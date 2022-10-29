/** @jest-environment jsdom */
/** @jsx createElement */

import {hrtime} from 'node:process';
import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {createElement} from '@snugjs/html';
import type {SpyInstance} from 'jest-mock';
import {CustomElement} from './index.js';

describe(`CustomElement`, () => {
  let consoleLog: SpyInstance;
  let consoleError: SpyInstance;
  let key: object;
  let tagName: string;

  beforeEach(() => {
    consoleLog = jest.spyOn(console, `log`);
    consoleError = jest.spyOn(console, `error`);
    key = {};
    tagName = `x-${hrtime.bigint()}`;
  });

  test(`connection`, async () => {
    const Test = CustomElement.define(tagName, {}, function* () {
      expect(this.isConnected).toBe(true);

      console.log(`connected`);

      try {
        while (true) {
          yield;

          console.log(`resumed`);
        }
      } finally {
        expect(this.isConnected).toBe(false);

        console.log(`disconnected`);
      }
    });

    const element = (<Test key={key} />) as CustomElement<{}>;

    expect(element.isConnected).toBe(false);
    expect(consoleLog).toHaveBeenCalledTimes(0);

    document.body.appendChild(element);

    expect(element.isConnected).toBe(true);
    expect(consoleLog).toHaveBeenCalledTimes(1);
    expect(consoleLog).toHaveBeenNthCalledWith(1, `connected`);

    element.remove();

    expect(element.isConnected).toBe(true);

    document.body.appendChild(element);

    expect(element.isConnected).toBe(true);

    await Promise.resolve();

    expect(element.isConnected).toBe(true);

    element.remove();

    expect(element.isConnected).toBe(true);
    expect(consoleLog).toHaveBeenCalledTimes(1);

    await Promise.resolve();

    expect(element.isConnected).toBe(false);
    expect(consoleLog).toHaveBeenCalledTimes(2);
    expect(consoleLog).toHaveBeenNthCalledWith(2, `disconnected`);

    document.body.appendChild(element);

    expect(element.isConnected).toBe(true);
    expect(consoleLog).toHaveBeenCalledTimes(3);
    expect(consoleLog).toHaveBeenNthCalledWith(3, `connected`);

    element.remove();

    expect(element.isConnected).toBe(true);

    await Promise.resolve();

    expect(element.isConnected).toBe(false);
    expect(consoleLog).toHaveBeenCalledTimes(4);
    expect(consoleLog).toHaveBeenNthCalledWith(4, `disconnected`);
    expect(consoleError).toHaveBeenCalledTimes(0);
  });

  test(`single pass`, async () => {
    const Test = CustomElement.define(tagName, {}, function* () {
      console.log(`executed`);
    });

    const element = (<Test key={key} />) as CustomElement<{}>;

    document.body.appendChild(element).remove();

    <Test key={key}>foo</Test>;

    await Promise.resolve();

    expect(consoleLog).toHaveBeenCalledTimes(1);
    expect(consoleLog).toHaveBeenNthCalledWith(1, `executed`);
    expect(consoleError).toHaveBeenCalledTimes(0);
  });

  test(`next function`, async () => {
    let nextFunction: (() => void) | undefined;

    const Test = CustomElement.define(tagName, {}, function* (next) {
      nextFunction = next;

      while (true) {
        next();
        next();

        yield;

        console.log(`resumed`);
      }
    });

    const element = (<Test key={key} />) as CustomElement<{}>;

    document.body.appendChild(element).remove();

    expect(consoleLog).toHaveBeenCalledTimes(0);

    nextFunction!();

    expect(consoleLog).toHaveBeenCalledTimes(1);
    expect(consoleLog).toHaveBeenNthCalledWith(1, `resumed`);

    nextFunction!();

    expect(consoleLog).toHaveBeenCalledTimes(2);
    expect(consoleLog).toHaveBeenNthCalledWith(2, `resumed`);

    await Promise.resolve();

    nextFunction!();
    nextFunction!();

    expect(consoleLog).toHaveBeenCalledTimes(2);
    expect(consoleError).toHaveBeenCalledTimes(0);
  });

  test(`default props`, () => {
    CustomElement.define(tagName, {}, function* () {});

    const customElement = document.createElement(tagName) as CustomElement<{}>;

    expect(customElement.props).toEqual({});
  });

  test(`update props`, async () => {
    const propsSchema = {n: `number?`} as const;

    const Test = CustomElement.define(tagName, propsSchema, function* () {
      let previousChildNodes = this.syntheticChildNodes;
      let previousProps = this.props;

      while (true) {
        yield;

        expect(previousChildNodes).not.toBe((previousChildNodes = this.syntheticChildNodes));
        expect(previousProps).not.toBe((previousProps = this.props));

        console.log(`resumed`);
      }
    });

    const element = (<Test key={key} />) as CustomElement<typeof propsSchema>;

    let currentChildNodes = element.syntheticChildNodes;
    let currentProps = element.props;

    expect(currentProps).toEqual({});

    document.body.appendChild(element).remove();

    <Test key={key} />;

    expect(consoleLog).toHaveBeenCalledTimes(0);
    expect(currentChildNodes).toBe(element.syntheticChildNodes);
    expect(currentProps).toBe(element.props);

    <Test key={key} n={NaN} />;

    expect(consoleLog).toHaveBeenCalledTimes(1);
    expect(consoleLog).toHaveBeenNthCalledWith(1, `resumed`);
    expect(currentChildNodes).not.toBe((currentChildNodes = element.syntheticChildNodes));
    expect(currentProps).not.toBe((currentProps = element.props));
    expect(currentProps).toEqual({n: NaN});

    <Test key={key} n={NaN} />;

    expect(consoleLog).toHaveBeenCalledTimes(1);
    expect(currentChildNodes).toBe(element.syntheticChildNodes);
    expect(currentProps).toBe(element.props);

    <Test key={key} n={Math.PI} />;

    expect(consoleLog).toHaveBeenCalledTimes(2);
    expect(consoleLog).toHaveBeenNthCalledWith(2, `resumed`);
    expect(currentChildNodes).not.toBe((currentChildNodes = element.syntheticChildNodes));
    expect(currentProps).not.toBe((currentProps = element.props));
    expect(currentProps).toEqual({n: Math.PI});

    <Test key={key} n={Math.PI} />;

    await Promise.resolve();

    expect(currentChildNodes).toBe(element.syntheticChildNodes);
    expect(currentProps).toBe(element.props);

    <Test key={key} />;

    expect(consoleLog).toHaveBeenCalledTimes(2);
    expect(currentChildNodes).not.toBe((currentChildNodes = element.syntheticChildNodes));
    expect(currentProps).not.toBe((currentProps = element.props));
    expect(currentProps).toEqual({});
    expect(consoleError).toHaveBeenCalledTimes(0);
  });

  test(`props schema`, () => {
    const propsSchema = {
      b1: `boolean`,
      b2: `boolean?`,
      n1: `number`,
      n2: `number?`,
      s1: `string`,
      s2: `string?`,
    } as const;

    const Test = CustomElement.define(tagName, propsSchema, function* () {});
    const element = (<Test key={key} b1={false} n1={0} s1={``} />) as CustomElement<typeof propsSchema>;

    expect(element.props).toEqual({b1: false, b2: false, n1: 0, s1: ``});
    expect(element.getAttributeNames()).toEqual([`n1`, `s1`]);
    expect(element.getAttribute(`n1`)).toBe(`0`);
    expect(element.getAttribute(`s1`)).toBe(``);

    <Test key={key} b1={true} b2={false} n1={Math.PI} n2={0} s1={`foo`} s2={``} />;

    expect(element.props).toEqual({b1: true, b2: false, n1: Math.PI, n2: 0, s1: `foo`, s2: ``});
    expect(element.getAttributeNames()).toEqual([`b1`, `n1`, `n2`, `s1`, `s2`]);
    expect(element.getAttribute(`b1`)).toBe(``);
    expect(element.getAttribute(`n1`)).toBe(`${Math.PI}`);
    expect(element.getAttribute(`n2`)).toBe(`0`);
    expect(element.getAttribute(`s1`)).toBe(`foo`);
    expect(element.getAttribute(`s2`)).toBe(``);
  });

  test(`default synthetic child nodes`, () => {
    CustomElement.define(tagName, {}, function* () {});

    const element = document.createElement(tagName) as CustomElement<{}>;

    expect(element.syntheticChildNodes).toEqual([]);
  });

  test(`update synthetic child nodes`, async () => {
    const Test = CustomElement.define(tagName, {}, function* () {
      let previousChildNodes = this.syntheticChildNodes;
      let previousProps = this.props;

      while (true) {
        yield;

        expect(previousChildNodes).not.toBe((previousChildNodes = this.syntheticChildNodes));
        expect(previousProps).not.toBe((previousProps = this.props));

        console.log(`resumed`);
      }
    });

    const element = (<Test key={key} />) as CustomElement<{}>;

    let currentChildNodes = element.syntheticChildNodes;
    let currentProps = element.props;

    expect(currentChildNodes).toEqual([]);

    document.body.appendChild(element).remove();

    <Test key={key}>{[]}</Test>;

    expect(consoleLog).toHaveBeenCalledTimes(0);
    expect(currentChildNodes).toBe(element.syntheticChildNodes);
    expect(currentProps).toBe(element.props);

    const childElement1 = <div />;
    const childElement2 = <div />;
    const childElement3 = <div />;

    <Test key={key}>
      {childElement1}
      {childElement2}
      {childElement3}
    </Test>;

    expect(consoleLog).toHaveBeenCalledTimes(1);
    expect(consoleLog).toHaveBeenNthCalledWith(1, `resumed`);
    expect(currentChildNodes).not.toBe((currentChildNodes = element.syntheticChildNodes));
    expect(currentChildNodes).toEqual([childElement1, childElement2, childElement3]);
    expect(currentProps).not.toBe((currentProps = element.props));

    <Test key={key}>{[childElement1, childElement2, childElement3]}</Test>;

    expect(consoleLog).toHaveBeenCalledTimes(1);
    expect(currentChildNodes).toBe(element.syntheticChildNodes);
    expect(currentProps).toBe(element.props);

    <Test key={key}>
      {childElement1}
      {childElement3}
      {childElement2}
    </Test>;

    expect(consoleLog).toHaveBeenCalledTimes(2);
    expect(consoleLog).toHaveBeenNthCalledWith(2, `resumed`);
    expect(currentChildNodes).not.toBe((currentChildNodes = element.syntheticChildNodes));
    expect(currentChildNodes).toEqual([childElement1, childElement3, childElement2]);
    expect(currentProps).not.toBe((currentProps = element.props));

    <Test key={key}>{[childElement1, childElement3, childElement2]}</Test>;

    expect(consoleLog).toHaveBeenCalledTimes(2);
    expect(currentChildNodes).toBe(element.syntheticChildNodes);
    expect(currentProps).toBe(element.props);

    <Test key={key}>{childElement1}</Test>;

    expect(consoleLog).toHaveBeenCalledTimes(3);
    expect(consoleLog).toHaveBeenNthCalledWith(3, `resumed`);
    expect(currentChildNodes).not.toBe((currentChildNodes = element.syntheticChildNodes));
    expect(currentChildNodes).toEqual([childElement1]);
    expect(currentProps).not.toBe((currentProps = element.props));

    <Test key={key}>{[childElement1]}</Test>;

    await Promise.resolve();

    expect(currentChildNodes).toBe(element.syntheticChildNodes);
    expect(currentProps).toBe(element.props);

    <Test key={key} />;

    expect(consoleLog).toHaveBeenCalledTimes(3);
    expect(currentChildNodes).not.toBe((currentChildNodes = element.syntheticChildNodes));
    expect(currentChildNodes).toEqual([]);
    expect(currentProps).not.toBe((currentProps = element.props));
    expect(consoleError).toHaveBeenCalledTimes(0);
  });

  test(`error on execute`, async () => {
    const Test = CustomElement.define(tagName, {}, function* () {
      throw new Error(`oops`);
    });

    const element = (<Test key={key} />) as CustomElement<{}>;

    document.body.appendChild(element).remove();

    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenNthCalledWith(1, `uncaught exception in web component:`, element, new Error(`oops`));

    await Promise.resolve();

    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  test(`error on resume`, async () => {
    const Test = CustomElement.define(tagName, {}, function* () {
      yield;

      throw new Error(`oops`);
    });

    const element = (<Test key={key} />) as CustomElement<{}>;

    document.body.appendChild(element).remove();

    expect(consoleError).toHaveBeenCalledTimes(0);

    <Test key={key}>foo</Test>;

    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenNthCalledWith(1, `uncaught exception in web component:`, element, new Error(`oops`));

    await Promise.resolve();

    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  test(`error on return`, async () => {
    const Test = CustomElement.define(tagName, {}, function* () {
      try {
        yield;
      } finally {
        throw new Error(`oops`);
      }
    });

    const element = (<Test key={key} />) as CustomElement<{}>;

    document.body.appendChild(element).remove();

    expect(consoleError).toHaveBeenCalledTimes(0);

    await Promise.resolve();

    expect(consoleError).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenNthCalledWith(1, `uncaught exception in web component:`, element, new Error(`oops`));
  });
});
