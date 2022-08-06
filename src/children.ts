import {Subject} from './subject.js';

export interface ChildrenInit {
  readonly element: HTMLElement;
  readonly activeSignal: AbortSignal;
}

export class Children extends Subject {
  readonly #element: HTMLElement;

  constructor({element, activeSignal}: ChildrenInit) {
    super();

    this.#element = element;

    const mutationObserver = new MutationObserver((mutations) => {
      let mutated = false;

      for (const {type} of mutations) {
        if (type === `childList`) {
          mutated = true;
        }
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

      mutationObserver.observe(element, {childList: true});
    }
  }

  get value(): DocumentFragment {
    const fragment = document.createDocumentFragment();

    fragment.append(...this.#element.childNodes);

    return fragment;
  }
}
