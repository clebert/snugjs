import {createElementFactory} from '@snugjs/html';
import type {
  CustomElement,
  CustomElementFactory,
  PropsSchema,
} from './custom-element.js';

export interface ElementRef<TElement> {
  readonly key: object;
  readonly element: TElement;
}

export function createElementRef<TTagName extends keyof HTMLElementTagNameMap>(
  tagName: TTagName,
): ElementRef<HTMLElementTagNameMap[TTagName]>;

export function createElementRef<TPropsSchema extends PropsSchema>(
  tagName: CustomElementFactory<TPropsSchema>,
): ElementRef<CustomElement<TPropsSchema>>;

export function createElementRef(
  tagName: string | {readonly tagName: string},
): ElementRef<HTMLElement>;

export function createElementRef(
  tagName: string | {readonly tagName: string},
): ElementRef<HTMLElement> {
  const key = {};

  const element = createElementFactory(
    typeof tagName === `string` ? tagName : tagName.tagName,
    nop,
  )({key}) as HTMLElement;

  return {key, element};
}

function nop() {}
