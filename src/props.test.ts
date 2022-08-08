/**
 * @jest-environment jsdom
 */

import {beforeEach, describe, expect, test} from '@jest/globals';
import {Props} from './props.js';
import {Subject} from './subject.js';

describe(`Props`, () => {
  let element: HTMLElement;
  let activeController: AbortController;
  let props: Props<{readonly number: number; readonly string: string}>;

  beforeEach(() => {
    element = document.createElement(`div`);
    activeController = new AbortController();
    props = new Props({element, activeSignal: activeController.signal});
  });

  test(`extends Subject class`, () => {
    expect(props).toBeInstanceOf(Subject);
  });

  describe(`the current signal is not aborted when attributes are mutated`, () => {
    test(`but only unknown ones change`, async () => {
      const {currentSignal} = props;

      element.setAttribute(`number`, `0`);
      element.setAttribute(`string`, `"a"`);

      await Promise.resolve();

      element.setAttribute(`number`, `1`);
      element.removeAttribute(`string`);

      await Promise.resolve();

      expect(currentSignal.aborted).toBe(false);
      expect(currentSignal).toBe(props.currentSignal);
      expect(props.value.number).toBe(1);
      expect(props.value.string).toBe(undefined);
    });

    test(`but none known ones change`, async () => {
      const {currentSignal} = props;

      element.setAttribute(`number`, `0`);
      element.setAttribute(`string`, `"a"`);

      expect(props.value.number).toBe(0);
      expect(props.value.string).toBe(`a`);

      await Promise.resolve();

      element.setAttribute(`number`, `1`);
      element.removeAttribute(`string`);

      expect(props.value.number).toBe(1);
      expect(props.value.string).toBe(undefined);

      element.removeAttribute(`number`);
      element.setAttribute(`number`, `1`);
      element.setAttribute(`string`, `"a"`);
      element.removeAttribute(`string`);

      await Promise.resolve();

      expect(currentSignal.aborted).toBe(false);
      expect(currentSignal).toBe(props.currentSignal);
      expect(props.value.number).toBe(1);
      expect(props.value.string).toBe(undefined);
    });

    test(`but the element is inactive`, async () => {
      activeController.abort();

      props = new Props({element, activeSignal: activeController.signal});

      const {currentSignal} = props;

      element.setAttribute(`number`, `0`);
      element.setAttribute(`string`, `"a"`);

      expect(props.value.number).toBe(0);
      expect(props.value.string).toBe(`a`);

      element.setAttribute(`number`, `1`);
      element.removeAttribute(`string`);

      await Promise.resolve();

      expect(currentSignal.aborted).toBe(false);
      expect(currentSignal).toBe(props.currentSignal);
      expect(props.value.number).toBe(1);
      expect(props.value.string).toBe(undefined);
    });

    test(`but the element becomes inactive`, async () => {
      const {currentSignal} = props;

      element.setAttribute(`number`, `0`);
      element.setAttribute(`string`, `"a"`);

      expect(props.value.number).toBe(0);
      expect(props.value.string).toBe(`a`);

      element.setAttribute(`number`, `1`);
      element.removeAttribute(`string`);
      activeController.abort();

      await Promise.resolve();

      expect(currentSignal.aborted).toBe(false);
      expect(currentSignal).toBe(props.currentSignal);
      expect(props.value.number).toBe(1);
      expect(props.value.string).toBe(undefined);
    });
  });

  describe(`the current signal is aborted when attributes are mutated`, () => {
    test(`and a known one changes`, async () => {
      const {currentSignal: currentSignal1} = props;

      element.setAttribute(`number`, `0`);
      element.setAttribute(`string`, `"a"`);

      expect(props.value.number).toBe(0);
      expect(props.value.string).toBe(`a`);

      element.setAttribute(`number`, `1`);

      await Promise.resolve();

      const {currentSignal: currentSignal2} = props;

      expect(currentSignal1.aborted).toBe(true);
      expect(currentSignal1).not.toBe(currentSignal2);
      expect(props.value.number).toBe(1);

      element.removeAttribute(`number`);

      await Promise.resolve();

      const {currentSignal: currentSignal3} = props;

      expect(currentSignal2.aborted).toBe(true);
      expect(currentSignal2).not.toBe(currentSignal3);
      expect(props.value.number).toBe(undefined);

      element.removeAttribute(`number`);
      element.setAttribute(`string`, `"a"`);

      await Promise.resolve();

      expect(currentSignal3.aborted).toBe(false);
      expect(currentSignal3).toBe(props.currentSignal);
      expect(props.value.number).toBe(undefined);
      expect(props.value.string).toBe(`a`);
    });

    test(`and an error occurs`, async () => {
      const {currentSignal} = props;

      element.setAttribute(`string`, `null`);

      await Promise.resolve();

      expect(currentSignal.aborted).toBe(true);
      expect(currentSignal).not.toBe(props.currentSignal);

      expect(() => props.value.string).toThrowError(
        `Illegal value found for the "string" attribute.`,
      );
    });
  });

  test(`values correspond to their types`, () => {
    const {value} = new Props({element, activeSignal: activeController.signal});

    element.setAttribute(`number1`, `0`);
    element.setAttribute(`number2`, String(Math.PI));
    element.setAttribute(`boolean1`, `false`);
    element.setAttribute(`boolean2`, `true`);
    element.setAttribute(`string1`, `""`);
    element.setAttribute(`string2`, `"abc"`);

    expect(value.number1).toBe(0);
    expect(value.number2).toBe(Math.PI);
    expect(value.boolean1).toBe(false);
    expect(value.boolean2).toBe(true);
    expect(value.string1).toBe(``);
    expect(value.string2).toBe(`abc`);
  });

  test(`parsing illegal values causes errors`, () => {
    const {value} = new Props({element, activeSignal: activeController.signal});

    element.setAttribute(`null`, `null`);
    element.setAttribute(`undefined`, `undefined`);
    element.setAttribute(`object`, `{}`);
    element.setAttribute(`array`, `[]`);

    expect(() => value.null).toThrowError(
      `Illegal value found for the "null" attribute.`,
    );

    expect(() => value.undefined).toThrowError(
      `Illegal value found for the "undefined" attribute.`,
    );

    expect(() => value.object).toThrowError(
      `Illegal value found for the "object" attribute.`,
    );

    expect(() => value.array).toThrowError(
      `Illegal value found for the "array" attribute.`,
    );
  });
});
