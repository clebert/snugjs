import {Children} from './children.js';
import type {CustomElementFunction, PropsValue} from './h.js';
import {Props} from './props.js';

export type ComponentFunction<TPropsValue extends PropsValue> = (
  this: HTMLElement,
  init: ComponentFunctionInit<TPropsValue>,
) => Component;

export interface ComponentFunctionInit<TPropsValue extends PropsValue> {
  readonly activeSignal: AbortSignal;
  readonly props: Props<TPropsValue>;
  readonly children: Children;
}

export type Component =
  | AsyncGenerator<AbortSignal, void, undefined>
  | Generator<AbortSignal, void, undefined>;

export class CustomElement<TPropsValue extends PropsValue> extends HTMLElement {
  static define<TPropsValue extends PropsValue>(
    customElementName: string,
    componentFunction: ComponentFunction<TPropsValue>,
  ): CustomElementFunction<TPropsValue> {
    customElements.define(
      customElementName,
      class extends CustomElement<TPropsValue> {
        constructor() {
          super(componentFunction);
        }
      },
    );

    return () => document.createElement(customElementName);
  }

  readonly #componentFunction: ComponentFunction<TPropsValue>;

  constructor(componentFunction: ComponentFunction<TPropsValue>) {
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
      props: new Props<TPropsValue>({element: this, activeSignal}),
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

    const signal = result.value;

    if (!signal.aborted) {
      infiniteLoop = false;

      await new Promise<void>((resolve) =>
        signal.addEventListener(`abort`, () => resolve(), {once: true}),
      );
    } else if (!infiniteLoop) {
      infiniteLoop = true;
    } else {
      await component.throw(new Error(`Infinite loop detected.`));
    }
  }
}
