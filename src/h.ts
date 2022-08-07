import type {CustomElementFunction} from './custom-element.js';

export function h<TProps extends object>(
  tag: CustomElementFunction<TProps>,
  attributes: Omit<TProps & {readonly key?: object}, 'children'>,
  ...children: 'children' extends {
    [TKey in keyof TProps]-?: {} extends Pick<TProps, TKey> ? never : TKey;
  }[keyof TProps]
    ? readonly [JSX.ElementChild, ...JSX.ElementChild[]]
    : readonly JSX.ElementChild[]
): HTMLElement;

export function h<TTagName extends keyof JSX.IntrinsicElements>(
  tag: TTagName,
  attributes: JSX.IntrinsicElements[TTagName],
  ...children: readonly JSX.ElementChild[]
): HTMLElementTagNameMap[TTagName];

export function h(
  tag: CustomElementFunction<any> | string,
  attributes: object | null,
  ...children: readonly unknown[]
): JSX.Element {
  const isTagName = typeof tag === `string`;

  const element = isTagName
    ? document.createElement(tag)
    : tag({key: attributes ? getKey(attributes) : undefined});

  if (typeof element === `string`) {
    return element;
  }

  const isFragment = element instanceof DocumentFragment;
  const isCustomElement = !isTagName && !isFragment;

  if (attributes && !isFragment) {
    for (const [key, value] of Object.entries(attributes)) {
      if (isCustomElement) {
        if (value != null && key !== `key` && key !== `children`) {
          element.setAttribute(key, JSON.stringify(value));
        }
      } else if (typeof value === `string` || typeof value === `number`) {
        element.setAttribute(key, String(value));
      } else if (value === true) {
        element.setAttribute(key, ``);
      }
    }
  }

  if (children.length > 0) {
    element.replaceChildren(sanitizeChildren(children));
  }

  return element;
}

function getKey(attributes: object): object | undefined {
  const key = (attributes as any).key as unknown;

  return key && typeof key === `object` ? key : undefined;
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
