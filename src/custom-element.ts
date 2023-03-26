import type {ElementFactory} from '@snugjs/html';

import {createElementFactory} from '@snugjs/html';

export type WebComponent<TPropsSchema extends PropsSchema> = (
  this: CustomElement<TPropsSchema>,
  args: WebComponentArgs,
) => Generator<void, void, undefined>;

export interface WebComponentArgs {
  readonly next: () => void;
  readonly signal: AbortSignal;
}

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

export type CustomElementFactory<TPropsSchema extends PropsSchema> =
  ElementFactory<Props<TPropsSchema>> & {readonly tagName: string};

export class CustomElement<
  TPropsSchema extends PropsSchema,
> extends HTMLElement {
  static define<TPropsSchema extends PropsSchema>(
    tagName: string,
    propsSchema: TPropsSchema,
    component: WebComponent<TPropsSchema>,
  ): CustomElementFactory<TPropsSchema> {
    customElements.define(
      tagName,
      class extends CustomElement<TPropsSchema> {
        constructor() {
          super(propsSchema, component);
        }
      },
    );

    const elementFactory = createElementFactory(
      tagName,
      (element, childNodes) =>
        (element as CustomElement<TPropsSchema>).#update(childNodes),
    );

    return Object.assign(elementFactory, {tagName: tagName.toUpperCase()});
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

  get syntheticChildNodes(): readonly Node[] {
    return this.#childNodes;
  }

  get props(): Props<TPropsSchema> {
    return this.#props;
  }

  protected connectedCallback(): void {
    if (!this.#connectionAbortController) {
      const {signal} = (this.#connectionAbortController =
        new AbortController());

      const generator = this.#component.call(this, {
        next: () => {
          const iterationAbortController = this.#iterationAbortController;

          if (iterationAbortController) {
            void Promise.resolve().then(() => iterationAbortController.abort());
          }
        },
        signal,
      });

      signal.addEventListener(`abort`, () =>
        this.#iterationAbortController?.abort(),
      );

      this.#execute(generator);
    }
  }

  protected disconnectedCallback(): void {
    if (!this.isConnected && this.#connectionAbortController) {
      const connectionAbortController = this.#connectionAbortController;

      this.#connectionAbortController = undefined;

      connectionAbortController.abort();
    }
  }

  #execute(generator: Generator<void, void, undefined>): void {
    try {
      if (this.isConnected) {
        if (!generator.next().done) {
          if (!this.isConnected) {
            generator.return();
          } else {
            (this.#iterationAbortController =
              new AbortController()).signal.addEventListener(`abort`, () =>
              this.#execute(generator),
            );
          }
        }
      } else {
        generator.return();
      }
    } catch (error) {
      console.error(`uncaught exception in web component:`, this, error);
    }
  }

  #update(childNodes: readonly Node[]): void {
    const props = this.#parseProps();

    if (
      isEqualChildren(childNodes, this.#childNodes) &&
      isEqualProps(props, this.#props)
    ) {
      return;
    }

    this.#childNodes = childNodes;
    this.#props = props;

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

function isEqualChildren(
  childNodes1: readonly Node[],
  childNodes2: readonly Node[],
): boolean {
  if (childNodes1.length !== childNodes2.length) {
    return false;
  }

  for (let index = 0; index < childNodes1.length; index += 1) {
    const childNode1 = childNodes1[index];
    const childNode2 = childNodes2[index];

    if (
      childNode1 !== childNode2 &&
      !(
        childNode1 instanceof Text &&
        childNode2 instanceof Text &&
        childNode1.nodeValue === childNode2.nodeValue
      )
    ) {
      return false;
    }
  }

  return true;
}

function isEqualProps(object1: object, object2: object): boolean {
  const values1 = Object.values(object1);
  const values2 = Object.values(object2);

  for (let index = 0; index < values1.length; index += 1) {
    if (!Object.is(values1[index], values2[index])) {
      return false;
    }
  }

  return true;
}
