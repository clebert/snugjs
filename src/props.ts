import {Subject} from './subject.js';

export interface PropsInit {
  readonly element: HTMLElement;
  readonly activeSignal: AbortSignal;
}

export class Props<TValue extends object> extends Subject {
  readonly #element: HTMLElement;

  readonly #attributeCache = new Map<
    string,
    {readonly attributeValue: string; readonly propValue: any}
  >();

  #cacheAttribute(attributeName: string, attributeValue: string | null): any {
    if (!attributeValue) {
      this.#attributeCache.delete(attributeName);

      return undefined;
    }

    const propValue = JSON.parse(attributeValue);

    this.#attributeCache.set(attributeName, {attributeValue, propValue});

    return propValue;
  }

  constructor({element, activeSignal}: PropsInit) {
    super();

    this.#element = element;

    const mutationObserver = new MutationObserver((mutations) => {
      let mutated = false;

      for (const {attributeName} of mutations) {
        if (!attributeName) {
          continue;
        }

        const attribute = this.#attributeCache.get(attributeName);
        const attributeValue = element.getAttribute(attributeName);

        if (attribute && attribute.attributeValue === attributeValue) {
          continue;
        }

        mutated = true;

        this.#cacheAttribute(attributeName, attributeValue);
      }

      if (mutated) {
        this.abort();
      }
    });

    if (!activeSignal.aborted) {
      activeSignal.addEventListener(
        `abort`,
        () => mutationObserver.disconnect(),
        {once: true},
      );

      mutationObserver.observe(element, {attributes: true});
    }
  }

  readonly value = new Proxy({} as TValue, {
    get: (_, attributeName) => {
      if (typeof attributeName !== `string`) {
        return undefined;
      }

      const attribute = this.#attributeCache.get(attributeName);
      const attributeValue = this.#element.getAttribute(attributeName);

      return attribute && attribute.attributeValue === attributeValue
        ? attribute.propValue
        : this.#cacheAttribute(attributeName, attributeValue);
    },
  });
}
