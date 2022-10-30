import type {ElementFactory} from '@snugjs/html';
import {createElementFactory} from '@snugjs/html';

export type WebComponent<TPropsSchema extends PropsSchema> = (
  this: CustomElement<TPropsSchema>,
  next: () => void,
  signal: AbortSignal,
) => Generator<void, void, undefined>;

export type PropsSchema = Record<
  string,
  'boolean' | 'boolean?' | 'number' | 'number?' | 'string' | 'string?'
>;

export type Props<TSchema> = OptionalProps<TSchema> & RequiredProps<TSchema>;

export type OptionalProps<TSchema> = {
  readonly [TKey in Keys<TSchema, 'boolean?' | 'number?' | 'string?'>]?: Prop<
    TSchema[TKey]
  >;
};

export type RequiredProps<TSchema> = {
  readonly [TKey in Keys<TSchema, 'boolean' | 'number' | 'string'>]: Prop<
    TSchema[TKey]
  >;
};

export type Keys<TSchema, TType> = {
  [TKey in keyof TSchema]: TSchema[TKey] extends TType ? TKey : never;
}[keyof TSchema];

export type Prop<TType> = TType extends 'boolean' | 'boolean?'
  ? boolean
  : TType extends 'number' | 'number?'
  ? number
  : TType extends 'string' | 'string?'
  ? string
  : never;

export class CustomElement<
  TPropsSchema extends PropsSchema,
> extends HTMLElement {
  static define<TPropsSchema extends PropsSchema>(
    tagName: string,
    propsSchema: TPropsSchema,
    component: WebComponent<TPropsSchema>,
  ): ElementFactory<Props<TPropsSchema>> {
    customElements.define(
      tagName,
      class extends CustomElement<TPropsSchema> {
        constructor() {
          super(propsSchema, component);
        }
      },
    );

    return createElementFactory(tagName, (element, childNodes) =>
      (element as CustomElement<TPropsSchema>).#update(childNodes),
    );
  }

  readonly #propsSchema: TPropsSchema;
  readonly #component: WebComponent<TPropsSchema>;

  #connectionAbortController: AbortController | undefined;
  #iterationAbortController: AbortController | undefined;
  #childNodes: readonly Node[] = [];
  #props: Props<TPropsSchema>;

  constructor(
    propsSchema: TPropsSchema,
    component: WebComponent<TPropsSchema>,
  ) {
    super();

    this.#propsSchema = propsSchema;
    this.#component = component;
    this.#props = this.#parseProps();
  }

  override get isConnected(): boolean {
    return this.#connectionAbortController ? true : false;
  }

  get syntheticChildNodes(): readonly Node[] {
    return this.#childNodes;
  }

  get props(): Props<TPropsSchema> {
    return this.#props;
  }

  protected connectedCallback(): void {
    if (super.isConnected && !this.#connectionAbortController) {
      const {signal} = (this.#connectionAbortController =
        new AbortController());

      const next = () => this.#iterationAbortController?.abort();
      const generator = this.#component.call(this, next, signal);

      signal.addEventListener(`abort`, next);
      this.#execute(generator);
    }
  }

  protected disconnectedCallback(): void {
    Promise.resolve().finally(() => this.#disconnect());
  }

  #disconnect(): void {
    if (!super.isConnected && this.#connectionAbortController) {
      const connectionAbortController = this.#connectionAbortController;

      this.#connectionAbortController = undefined;

      connectionAbortController.abort();
    }
  }

  #execute(generator: Generator<void, void, undefined>): void {
    try {
      if (this.isConnected) {
        if (!generator.next().done) {
          this.#iterationAbortController = new AbortController();

          this.#iterationAbortController.signal.addEventListener(`abort`, () =>
            this.#execute(generator),
          );
        }
      } else {
        generator.return();
      }
    } catch (error) {
      console.error(`uncaught exception in web component:`, this, error);
    }
  }

  #update(childNodes: readonly Node[]): void {
    let props: Props<TPropsSchema> | undefined;

    if (isShallowEqual(childNodes, this.#childNodes)) {
      props = this.#parseProps();

      if (isShallowEqual(props, this.#props)) {
        return;
      }
    }

    this.#childNodes = childNodes;
    this.#props = props ?? this.#parseProps();

    this.#iterationAbortController?.abort();
  }

  #parseProps(): Props<TPropsSchema> {
    return Object.fromEntries(
      Object.entries(this.#propsSchema).map(([key, type]) => {
        const value = this.getAttribute(key);

        switch (type) {
          case `boolean`:
          case `boolean?`: {
            return [key, value !== null];
          }
          case `number`:
          case `number?`: {
            return [key, value !== null ? parseFloat(value) : undefined];
          }
          default: {
            return [key, value !== null ? value : undefined];
          }
        }
      }),
    );
  }
}

function isShallowEqual(object1: object, object2: object): boolean {
  const values1 = Array.isArray(object1) ? object1 : Object.values(object1);
  const values2 = Array.isArray(object2) ? object2 : Object.values(object2);

  if (values1.length !== values2.length) {
    return false;
  }

  for (let index = 0; index < values1.length; index += 1) {
    if (!Object.is(values1[index], values2[index])) {
      return false;
    }
  }

  return true;
}
