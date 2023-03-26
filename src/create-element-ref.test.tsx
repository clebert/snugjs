/** @jest-environment jsdom */

import type {ElementRef} from './index.js';

import {CustomElement, createElementRef} from './index.js';
import {expect, test} from '@jest/globals';
import {createElement} from '@snugjs/html';

test(`createElementRef()`, () => {
  const Custom = CustomElement.define(`x-custom`, {}, function* () {});
  const custom: ElementRef<HTMLElement> = createElementRef(Custom);
  const div: ElementRef<HTMLDivElement> = createElementRef(`div`);

  expect(custom.element).toBeInstanceOf(HTMLElement);
  expect(div.element).toBeInstanceOf(HTMLDivElement);
  expect(<Custom key={custom.key} />).toBe(custom.element);
  expect(<div key={div.key} />).toBe(div.element);
});
