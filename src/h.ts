export type PropsValue = Record<string, boolean | number | string | undefined>;

export type CustomElementFunction<TPropsValue extends PropsValue = {}> = (
  props: TPropsValue & JSX.ElementChildrenAttribute & JSX.ElementKeyAttribute,
) => JSX.Element;

export type Tag = string | CustomElementFunction<{}>;

export function h<TTagName extends keyof JSX.IntrinsicElements>(
  tag: TTagName,
  attributes: JSX.IntrinsicElements[TTagName] & {readonly key?: object},
  ...children: readonly any[]
): HTMLElementTagNameMap[TTagName];

export function h<TPropsValue extends PropsValue>(
  tag: CustomElementFunction<TPropsValue>,
  attributes: TPropsValue & {readonly key?: object},
  ...children: readonly any[]
): JSX.Element;

export function h(
  tag: Tag,
  attributes: object | null,
  ...children: readonly unknown[]
): JSX.Element {
  const key = attributes ? getKey(attributes) : undefined;
  const cacheEntry = key ? h.cache.get(key) : undefined;

  if (cacheEntry && cacheEntry.tag !== tag) {
    throw new Error(
      `Cannot reuse the same key for different types of elements.`,
    );
  }

  const isTagName = typeof tag === `string`;

  const element = cacheEntry
    ? cacheEntry.element
    : isTagName
    ? document.createElement(tag)
    : (tag as () => JSX.Element)();

  const isFragment = element instanceof DocumentFragment;

  if (!isFragment && key && !cacheEntry) {
    h.cache.set(key, {tag, element});
  }

  const isCustomElement = !isTagName && !isFragment;

  if (!isFragment) {
    replaceAttributes(element, isCustomElement, attributes);
  }

  element.replaceChildren(sanitizeChildren(children));

  return element;
}

h.cache = new WeakMap<object, Readonly<{tag: Tag; element: HTMLElement}>>();

function getKey(attributes: object): object | undefined {
  const key = (attributes as Record<string, unknown>).key;

  return key && typeof key === `object` ? key : undefined;
}

function replaceAttributes(
  element: HTMLElement,
  isCustomElement: boolean,
  attributes: object | null,
): void {
  for (const attributeName of element.getAttributeNames()) {
    element.removeAttribute(attributeName);
  }

  if (!attributes) {
    return;
  }

  for (const [attributeName, attributeValue] of Object.entries(attributes)) {
    if (attributeName === `key`) {
      continue;
    }

    switch (typeof attributeValue) {
      case `boolean`: {
        if (isCustomElement) {
          element.setAttribute(attributeName, String(attributeValue));
        } else if (attributeValue === true) {
          element.setAttribute(attributeName, ``);
        }

        break;
      }
      case `number`: {
        if (Number.isFinite(attributeValue)) {
          element.setAttribute(attributeName, String(attributeValue));
        } else {
          throw new Error(
            `Cannot set a non-finite number value for the "${attributeName}" attribute.`,
          );
        }

        break;
      }
      case `string`: {
        if (isCustomElement) {
          element.setAttribute(attributeName, JSON.stringify(attributeValue));
        } else {
          element.setAttribute(attributeName, attributeValue);
        }

        break;
      }
      case `undefined`: {
        break;
      }
      default: {
        throw new Error(
          `Cannot set an illegal value for the "${attributeName}" attribute.`,
        );
      }
    }
  }
}

function sanitizeChildren(children: readonly unknown[]): DocumentFragment {
  const fragment = document.createDocumentFragment();

  for (const child of children) {
    if (Array.isArray(child)) {
      fragment.appendChild(sanitizeChildren(child));
    } else if (
      child instanceof HTMLElement ||
      child instanceof DocumentFragment
    ) {
      fragment.appendChild(child);
    } else if (typeof child === `string` || typeof child === `number`) {
      fragment.append(String(child));
    }
  }

  return fragment;
}
