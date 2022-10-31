import {createElementFactory} from '@snugjs/html';

export interface ElementRef<TElement> {
  readonly key: object;
  readonly element: TElement;
}

export function createElementRef<TTagName extends keyof HTMLElementTagNameMap>(
  tagName: TTagName,
): ElementRef<HTMLElementTagNameMap[TTagName]>;

export function createElementRef(tagName: string): ElementRef<HTMLElement>;

export function createElementRef(tagName: string): ElementRef<HTMLElement> {
  const key = {};

  return {
    key,
    element: createElementFactory(tagName, nop)({key}) as HTMLElement,
  };
}

function nop() {}
