/**
 * @jest-environment jsdom
 */

import {describe, expect, test} from '@jest/globals';
import type {CustomElementFunction} from './custom-element.js';
import {Fragment} from './fragment.js';
import {h} from './h.js';

describe(`h()`, () => {
  describe(`intrinsic elements`, () => {
    test(`elements correspond in type to their tag names`, () => {
      expect(h(`a`, {})).toBeInstanceOf(HTMLAnchorElement);
      expect(<a />).toBeInstanceOf(HTMLAnchorElement);
      expect(h(`div`, {})).toBeInstanceOf(HTMLDivElement);
      expect(<div />).toBeInstanceOf(HTMLDivElement);
    });

    test(`elements can be newly created or reused with a key`, () => {
      const key1 = {};
      const key2 = {};

      expect(h(`a`, {})).not.toBe(<a />);
      expect(h(`a`, {key: key1})).toBe(<a key={key1} />);
      expect(h(`a`, {key: key1})).not.toBe(<a key={key2} />);
      expect(h(`a`, {key: key2})).not.toBe(<a key={key1} />);
      expect(h(`a`, {key: key2})).toBe(<a key={key2} />);
    });

    test(`reusing the same key for elements with different types causes errors`, () => {
      const key = {};

      h(`a`, {key});

      expect(() => <div key={key} />).toThrowError(
        `Cannot reuse the same key for different types of elements.`,
      );
    });

    test(`attributes are replaced as plain string values`, () => {
      const key = {};

      const element = h(`a`, {
        key,
        autofocus: true,
        class: undefined,
        id: `foo`,
        tabindex: 42,
      });

      expect(element.getAttributeNames()).toEqual([
        `autofocus`,
        `id`,
        `tabindex`,
      ]);

      expect(element.getAttribute(`autofocus`)).toBe(``);
      expect(element.getAttribute(`id`)).toBe(`foo`);
      expect(element.getAttribute(`tabindex`)).toBe(`42`);

      <a
        key={key}
        contenteditable="false"
        hidden={false}
        href=""
        tabindex={0}
      />;

      expect(element.getAttributeNames()).toEqual([
        `contenteditable`,
        `href`,
        `tabindex`,
      ]);

      expect(element.getAttribute(`contenteditable`)).toBe(`false`);
      expect(element.getAttribute(`href`)).toBe(``);
      expect(element.getAttribute(`tabindex`)).toBe(`0`);
    });

    test(`setting illegal attributes causes errors`, () => {
      expect(() => h(`a`, {tabindex: NaN})).toThrowError(
        `Cannot set a non-finite number value for the "tabindex" attribute.`,
      );

      expect(() => <a href={null as any} />).toThrowError(
        `Cannot set an illegal value for the "href" attribute.`,
      );
    });

    test(`children are replaced`, () => {
      const key = {};

      const element = (
        <a key={key}>
          <span />
          foo
          {`bar`}
          {false}
          {0}
          {null}
          {undefined}
          {[<div />, [`baz`, true, 42, null, undefined]]}
        </a>
      );

      expect(element.childNodes).toHaveLength(7);
      expect(element.childNodes[0]!.nodeType).toBe(document.ELEMENT_NODE);
      expect((element.childNodes[0] as HTMLElement).tagName).toBe(`SPAN`);
      expect(element.childNodes[1]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[1]!.textContent).toBe(`foo`);
      expect(element.childNodes[2]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[2]!.textContent).toBe(`bar`);
      expect(element.childNodes[3]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[3]!.textContent).toBe(`0`);
      expect(element.childNodes[4]!.nodeType).toBe(document.ELEMENT_NODE);
      expect((element.childNodes[4] as HTMLElement).tagName).toBe(`DIV`);
      expect(element.childNodes[5]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[5]!.textContent).toBe(`baz`);
      expect(element.childNodes[6]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[6]!.textContent).toBe(`42`);

      h(`a`, {key}, h(`a`, {}), `a`, `b`, false, 1, null, undefined, [
        h(`section`, {}),
        [`c`, true, Math.PI, null, undefined],
      ]);

      expect(element.childNodes).toHaveLength(7);
      expect(element.childNodes[0]!.nodeType).toBe(document.ELEMENT_NODE);
      expect((element.childNodes[0] as HTMLElement).tagName).toBe(`A`);
      expect(element.childNodes[1]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[1]!.textContent).toBe(`a`);
      expect(element.childNodes[2]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[2]!.textContent).toBe(`b`);
      expect(element.childNodes[3]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[3]!.textContent).toBe(`1`);
      expect(element.childNodes[4]!.nodeType).toBe(document.ELEMENT_NODE);
      expect((element.childNodes[4] as HTMLElement).tagName).toBe(`SECTION`);
      expect(element.childNodes[5]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[5]!.textContent).toBe(`c`);
      expect(element.childNodes[6]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[6]!.textContent).toBe(`${Math.PI}`);

      h(`a`, {key});

      expect(element.childNodes).toHaveLength(0);
    });
  });

  describe(`custom elements`, () => {
    test(`elements can be newly created or reused`, () => {
      const Test: CustomElementFunction<{}> = () =>
        document.createElement(`x-test`);

      const key1 = {};
      const key2 = {};

      expect(h(Test, {})).not.toBe(<Test />);
      expect(h(Test, {key: key1})).toBe(<Test key={key1} />);
      expect(h(Test, {key: key1})).not.toBe(<Test key={key2} />);
      expect(h(Test, {key: key2})).not.toBe(<Test key={key1} />);
      expect(h(Test, {key: key2})).toBe(<Test key={key2} />);
    });

    test(`reusing the same key for elements with different types causes errors`, () => {
      const Test1: CustomElementFunction<{}> = () =>
        document.createElement(`x-test1`);

      const Test2: CustomElementFunction<{}> = () =>
        document.createElement(`x-test2`);

      const key = {};

      h(Test1, {key});

      expect(() => <Test2 key={key} />).toThrowError(
        `Cannot reuse the same key for different types of elements.`,
      );

      expect(() => <a key={key} />).toThrowError(
        `Cannot reuse the same key for different types of elements.`,
      );
    });

    test(`attributes are replaced as JSON string values`, () => {
      const Test: CustomElementFunction<{
        readonly boolean1?: boolean;
        readonly boolean2?: boolean;
        readonly number1?: number;
        readonly number2?: number;
        readonly string1?: string;
        readonly string2?: string;
      }> = () => document.createElement(`x-test`);

      const key = {};

      const element = h(Test, {
        key,
        boolean1: true,
        boolean2: undefined,
        number1: 42,
        string1: `foo`,
      }) as HTMLElement;

      expect(element.getAttributeNames()).toEqual([
        `boolean1`,
        `number1`,
        `string1`,
      ]);

      expect(element.getAttribute(`boolean1`)).toBe(`true`);
      expect(element.getAttribute(`number1`)).toBe(`42`);
      expect(element.getAttribute(`string1`)).toBe(`"foo"`);

      <Test key={key} boolean2={false} number2={Math.PI} string2="" />;

      expect(element.getAttributeNames()).toEqual([
        `boolean2`,
        `number2`,
        `string2`,
      ]);

      expect(element.getAttribute(`boolean2`)).toBe(`false`);
      expect(element.getAttribute(`number2`)).toBe(`${Math.PI}`);
      expect(element.getAttribute(`string2`)).toBe(`""`);
    });

    test(`setting illegal attributes causes errors`, () => {
      const Test: CustomElementFunction<{
        readonly any: any;
      }> = () => document.createElement(`x-test`);

      expect(() => h(Test, {any: NaN})).toThrowError(
        `Cannot set a non-finite number value for the "any" attribute.`,
      );

      expect(() => <Test any={null} />).toThrowError(
        `Cannot set an illegal value for the "any" attribute.`,
      );
    });

    test(`children are replaced`, () => {
      const Test: CustomElementFunction<{}> = () =>
        document.createElement(`x-test`);

      const key = {};

      const element = (
        <Test key={key}>
          <span />
          foo
          {`bar`}
          {false}
          {0}
          {null}
          {undefined}
          {[<div />, [`baz`, true, 42, null, undefined]]}
        </Test>
      );

      expect(element.childNodes).toHaveLength(7);
      expect(element.childNodes[0]!.nodeType).toBe(document.ELEMENT_NODE);
      expect((element.childNodes[0] as HTMLElement).tagName).toBe(`SPAN`);
      expect(element.childNodes[1]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[1]!.textContent).toBe(`foo`);
      expect(element.childNodes[2]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[2]!.textContent).toBe(`bar`);
      expect(element.childNodes[3]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[3]!.textContent).toBe(`0`);
      expect(element.childNodes[4]!.nodeType).toBe(document.ELEMENT_NODE);
      expect((element.childNodes[4] as HTMLElement).tagName).toBe(`DIV`);
      expect(element.childNodes[5]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[5]!.textContent).toBe(`baz`);
      expect(element.childNodes[6]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[6]!.textContent).toBe(`42`);

      h(Test, {key}, h(`a`, {}), `a`, `b`, false, 1, null, undefined, [
        h(`section`, {}),
        [`c`, true, Math.PI, null, undefined],
      ]);

      expect(element.childNodes).toHaveLength(7);
      expect(element.childNodes[0]!.nodeType).toBe(document.ELEMENT_NODE);
      expect((element.childNodes[0] as HTMLElement).tagName).toBe(`A`);
      expect(element.childNodes[1]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[1]!.textContent).toBe(`a`);
      expect(element.childNodes[2]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[2]!.textContent).toBe(`b`);
      expect(element.childNodes[3]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[3]!.textContent).toBe(`1`);
      expect(element.childNodes[4]!.nodeType).toBe(document.ELEMENT_NODE);
      expect((element.childNodes[4] as HTMLElement).tagName).toBe(`SECTION`);
      expect(element.childNodes[5]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[5]!.textContent).toBe(`c`);
      expect(element.childNodes[6]!.nodeType).toBe(document.TEXT_NODE);
      expect(element.childNodes[6]!.textContent).toBe(`${Math.PI}`);

      h(Test, {key});

      expect(element.childNodes).toHaveLength(0);
    });
  });

  describe(`fragments`, () => {
    test(`fragments can be newly created`, () => {
      expect(h(Fragment, {})).not.toBe(<></>);
    });

    test(`children are replaced`, () => {
      const jsxFragment = (
        <>
          <span />
          foo
          {`bar`}
          {false}
          {0}
          {null}
          {undefined}
          {[<div />, [`baz`, true, 42, null, undefined]]}
        </>
      );

      expect(jsxFragment.childNodes).toHaveLength(7);
      expect(jsxFragment.childNodes[0]!.nodeType).toBe(document.ELEMENT_NODE);
      expect((jsxFragment.childNodes[0] as HTMLElement).tagName).toBe(`SPAN`);
      expect(jsxFragment.childNodes[1]!.nodeType).toBe(document.TEXT_NODE);
      expect(jsxFragment.childNodes[1]!.textContent).toBe(`foo`);
      expect(jsxFragment.childNodes[2]!.nodeType).toBe(document.TEXT_NODE);
      expect(jsxFragment.childNodes[2]!.textContent).toBe(`bar`);
      expect(jsxFragment.childNodes[3]!.nodeType).toBe(document.TEXT_NODE);
      expect(jsxFragment.childNodes[3]!.textContent).toBe(`0`);
      expect(jsxFragment.childNodes[4]!.nodeType).toBe(document.ELEMENT_NODE);
      expect((jsxFragment.childNodes[4] as HTMLElement).tagName).toBe(`DIV`);
      expect(jsxFragment.childNodes[5]!.nodeType).toBe(document.TEXT_NODE);
      expect(jsxFragment.childNodes[5]!.textContent).toBe(`baz`);
      expect(jsxFragment.childNodes[6]!.nodeType).toBe(document.TEXT_NODE);
      expect(jsxFragment.childNodes[6]!.textContent).toBe(`42`);

      const fragment = h(
        Fragment,
        {},
        h(`a`, {}),
        `a`,
        `b`,
        false,
        1,
        null,
        undefined,
        [h(`section`, {}), [`c`, true, Math.PI, null, undefined]],
      );

      expect(fragment.childNodes).toHaveLength(7);
      expect(fragment.childNodes[0]!.nodeType).toBe(document.ELEMENT_NODE);
      expect((fragment.childNodes[0] as HTMLElement).tagName).toBe(`A`);
      expect(fragment.childNodes[1]!.nodeType).toBe(document.TEXT_NODE);
      expect(fragment.childNodes[1]!.textContent).toBe(`a`);
      expect(fragment.childNodes[2]!.nodeType).toBe(document.TEXT_NODE);
      expect(fragment.childNodes[2]!.textContent).toBe(`b`);
      expect(fragment.childNodes[3]!.nodeType).toBe(document.TEXT_NODE);
      expect(fragment.childNodes[3]!.textContent).toBe(`1`);
      expect(fragment.childNodes[4]!.nodeType).toBe(document.ELEMENT_NODE);
      expect((fragment.childNodes[4] as HTMLElement).tagName).toBe(`SECTION`);
      expect(fragment.childNodes[5]!.nodeType).toBe(document.TEXT_NODE);
      expect(fragment.childNodes[5]!.textContent).toBe(`c`);
      expect(fragment.childNodes[6]!.nodeType).toBe(document.TEXT_NODE);
      expect(fragment.childNodes[6]!.textContent).toBe(`${Math.PI}`);

      h(() => fragment, {});

      expect(fragment.childNodes).toHaveLength(0);
    });
  });
});
