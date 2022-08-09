import type {PropsValue} from './h.js';
import {Subject} from './subject.js';

export interface PropsInit {
  readonly element: HTMLElement;
  readonly activeSignal: AbortSignal;
}

export class Props<TValue extends PropsValue> extends Subject {
  readonly #namesOfKnownAttributes = new Set<string>();

  readonly #cache = new Map<
    string,
    {readonly attributeValue: string; readonly propValue: any}
  >();

  readonly #element: HTMLElement;

  constructor({element, activeSignal}: PropsInit) {
    super();

    this.#element = element;

    const mutationObserver = new MutationObserver((mutations) => {
      const namesOfMutatedAttributes = new Set<string>();

      for (const {attributeName} of mutations) {
        namesOfMutatedAttributes.add(attributeName!);
      }

      let mutated = false;

      try {
        for (const attributeName of namesOfMutatedAttributes) {
          const cacheEntry = this.#cache.get(attributeName);
          const attributeValue = this.#element.getAttribute(attributeName);

          if (attributeValue) {
            if (!cacheEntry || cacheEntry.attributeValue !== attributeValue) {
              this.#cache.set(attributeName, {
                attributeValue,
                propValue: parseAttribute(attributeName, attributeValue),
              });

              mutated = this.#namesOfKnownAttributes.has(attributeName);
            }
          } else if (cacheEntry) {
            this.#cache.delete(attributeName);

            mutated = this.#namesOfKnownAttributes.has(attributeName);
          }
        }
      } catch {
        mutated = true;
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
    get: (_, attributeName: string) => {
      this.#namesOfKnownAttributes.add(attributeName);

      const cacheEntry = this.#cache.get(attributeName);
      const attributeValue = this.#element.getAttribute(attributeName);

      if (cacheEntry && cacheEntry.attributeValue === attributeValue) {
        return cacheEntry.propValue;
      }

      if (!attributeValue) {
        this.#cache.delete(attributeName);

        return undefined;
      }

      const propValue = parseAttribute(attributeName, attributeValue);

      this.#cache.set(attributeName, {attributeValue, propValue});

      return propValue;
    },
  });
}

function parseAttribute(attributeName: string, attributeValue: string): any {
  try {
    const propValue = JSON.parse(attributeValue);

    switch (typeof propValue) {
      case `boolean`:
      case `number`:
      case `string`: {
        return propValue;
      }
    }
  } catch {}

  throw new Error(`Illegal value found for the "${attributeName}" attribute.`);
}
