import {Children} from './children.js';
import {Props} from './props.js';

export type ComponentFunction<TProps extends object> = (
  this: HTMLElement,
  init: ComponentFunctionInit<TProps>,
) => Component;

export interface ComponentFunctionInit<TProps extends object> {
  readonly activeSignal: AbortSignal;
  readonly props: Props<TProps>;
  readonly children: Children;
}

export type Component =
  | AsyncGenerator<() => AbortSignal, void, undefined>
  | Generator<() => AbortSignal, void, undefined>;

export type CustomElementFunction<TProps extends object> = (
  props: TProps & {
    readonly key?: object;
    readonly children?: JSX.ElementChild | readonly JSX.ElementChild[];
  },
) => JSX.Element;

export class CustomElement<TProps extends object> extends HTMLElement {
  static define<TProps extends object>(
    customElementName: string,
    componentFunction: ComponentFunction<TProps>,
  ): CustomElementFunction<TProps> {
    customElements.define(
      customElementName,
      class extends CustomElement<TProps> {
        constructor() {
          super(componentFunction);
        }
      },
    );

    const elements = new WeakMap<object, JSX.Element>();

    return ({key}) => {
      if (!key) {
        return document.createElement(customElementName);
      }

      let element = elements.get(key);

      if (!element) {
        elements.set(
          key,
          (element = document.createElement(customElementName)),
        );
      }

      return element;
    };
  }

  readonly #componentFunction: ComponentFunction<TProps>;

  constructor(componentFunction: ComponentFunction<TProps>) {
    super();

    this.#componentFunction = componentFunction;
  }

  #activeController: AbortController | undefined;

  override get isConnected(): boolean {
    return this.#activeController ? true : false;
  }

  protected connectedCallback(): void {
    if (!super.isConnected || this.#activeController) {
      return;
    }

    const activeController = (this.#activeController = new AbortController());
    const activeSignal = this.#activeController.signal;

    const component = this.#componentFunction.call(this, {
      activeSignal,
      props: new Props<TProps>({element: this, activeSignal}),
      children: new Children({element: this, activeSignal}),
    });

    const errorEventName = `customelementerror`;

    this.addEventListener(errorEventName, (event) => {
      if (event.target !== this && event instanceof CustomEvent) {
        event.preventDefault();
        event.stopImmediatePropagation();
        void component.throw(event.detail);
        activeController.abort();
      }
    });

    run(component).catch((error: unknown) => {
      if (!activeSignal.aborted) {
        const unprevented = this.dispatchEvent(
          new CustomEvent(errorEventName, {
            detail: error,
            bubbles: true,
            cancelable: true,
            composed: true,
          }),
        );

        if (unprevented) {
          console.error(error);
        }
      }
    });
  }

  #disconnectionTimeout: any;

  protected disconnectedCallback(): void {
    clearTimeout(this.#disconnectionTimeout);

    this.#disconnectionTimeout = setTimeout(() => {
      if (!super.isConnected && this.#activeController) {
        const activeController = this.#activeController;
        this.#activeController = undefined;
        activeController.abort();
      }
    }, 0);
  }
}

async function run(component: Component): Promise<void> {
  let infiniteLoop = false;

  while (true) {
    const result = await component.next();

    if (result.done) {
      return;
    }

    let signal: AbortSignal | undefined;

    try {
      signal = result.value();
    } catch (error) {
      await component.throw(error);
    }

    if (signal) {
      if (!signal.aborted) {
        infiniteLoop = false;

        await new Promise<void>((resolve) =>
          signal!.addEventListener(`abort`, () => resolve(), {once: true}),
        );
      } else if (!infiniteLoop) {
        infiniteLoop = true;
      } else {
        await component.throw(new Error(`Infinite loop detected.`));
      }
    }
  }
}
