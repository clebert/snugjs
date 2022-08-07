/**
 * @jest-environment jsdom
 */

import {describe, test} from '@jest/globals';
import type {CustomElementFunction} from './custom-element.js';
import {h} from './h.js';

describe(`h()`, () => {
  test(`optional/required children of custom elements`, () => {
    const ImplicitOptionalChildren: CustomElementFunction<object> = () =>
      document.createElement(`a`);

    h(ImplicitOptionalChildren, {});
    h(ImplicitOptionalChildren, {}, `foo`);
    h(ImplicitOptionalChildren, {}, `foo`, `bar`);

    const ExplicitOptionalChildren: CustomElementFunction<{
      readonly children?: JSX.ElementChild | readonly JSX.ElementChild[];
    }> = () => document.createElement(`a`);

    h(ExplicitOptionalChildren, {});
    h(ExplicitOptionalChildren, {}, `foo`);
    h(ExplicitOptionalChildren, {}, `foo`, `bar`);

    const RequiredChildren: CustomElementFunction<{
      readonly children: JSX.ElementChild | readonly JSX.ElementChild[];
    }> = () => document.createElement(`a`);

    // @ts-expect-error
    h(RequiredChildren, {});
    h(RequiredChildren, {}, `foo`);
    h(RequiredChildren, {}, `foo`, `bar`);
  });
});
