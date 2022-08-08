/**
 * @jest-environment jsdom
 */

import {describe, expect, test} from '@jest/globals';
import {h} from './h.js';
import {ref} from './ref.js';

describe(`ref()`, () => {
  test(`the getter passes a stable key to the callback on each call`, () => {
    const getElement1 = ref<HTMLAnchorElement>((key) => <a key={key}></a>);
    const getElement2 = ref<HTMLAnchorElement>((key) => <a key={key}></a>);

    expect(getElement1()).toBe(getElement1());
    expect(getElement1()).not.toBe(getElement2());
    expect(getElement2()).toBe(getElement2());
  });
});
