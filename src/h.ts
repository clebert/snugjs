import type {CustomElement, CustomElementFunction} from './custom-element.js';

export function h<TProps extends object>(
  tag: CustomElementFunction<TProps>,
  attributes: TProps & {readonly key?: object; readonly children?: void},
): CustomElement<TProps>;

export function h<TAttributeName extends keyof JSX.IntrinsicElements>(
  tag: TAttributeName,
  attributes: JSX.IntrinsicElements[TAttributeName],
  ...children: JSX.ElementChild[]
): HTMLElementTagNameMap[TAttributeName];

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

  if (!isCustomElement) {
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
    } else if (child != null && child !== false) {
      fragment.append(String(child));
    }
  }

  return fragment;
}
