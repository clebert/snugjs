/** @jest-environment jsdom */

import type {SpyInstance} from 'jest-mock';

import {CustomElement, createElementRef} from './index.js';
import {beforeEach, describe, expect, jest, test} from '@jest/globals';
import {createElement} from '@snugjs/html';

const VariousChildren = CustomElement.define(
  `x-various-children`,
  {},
  function* () {},
);

const VariousProps = CustomElement.define(
  `x-various-props`,
  {
    b1: `boolean`,
    b2: `boolean?`,
    n1: `number`,
    n2: `number?`,
    s1: `string`,
    s2: `string?`,
  },
  function* () {},
);

const ExternalUpdate = CustomElement.define(
  `x-external-update`,
  {n: `number?`},
  function* () {
    let iteration = 0;
    let prevChildNodes = this.syntheticChildNodes;
    let prevProps = this.props;

    while (true) {
      this.replaceChildren(`#${(iteration += 1)}`);

      yield;

      expect(prevChildNodes).not.toBe(
        (prevChildNodes = this.syntheticChildNodes),
      );

      expect(prevProps).not.toBe((prevProps = this.props));
    }
  },
);

const InternalUpdate = CustomElement.define(
  `x-internal-update`,
  {},
  function* ({next, signal}) {
    let iteration = 0;
    let state = 0;

    const button = createElementRef(`button`);

    button.element.addEventListener(
      `click`,
      () => {
        state += 1;

        next();
      },
      {signal},
    );

    try {
      while (true) {
        expect(signal.aborted).toBe(false);

        this.replaceChildren(
          `#${(iteration += 1)}: ${state}`,
          <button key={button.key} />,
        );

        yield;
      }
    } finally {
      expect(signal.aborted).toBe(true);

      this.replaceChildren(`#${(iteration += 1)}: ${state}; disconnected`);
    }
  },
);

const InitialError = CustomElement.define(`x-initial-error`, {}, function* () {
  throw new Error(`oops`);
});

const IterationError = CustomElement.define(
  `x-iteration-error`,
  {},
  function* () {
    try {
      yield;
    } finally {
      throw new Error(`oops`);
    }
  },
);

const NoEffect = CustomElement.define(`x-no-effect`, {}, function* ({next}) {
  next();
});

const SelfRemoval = CustomElement.define(
  `x-self-removal`,
  {},
  function* ({signal}) {
    let iteration = 0;

    try {
      while (true) {
        expect(signal.aborted).toBe(false);

        this.replaceChildren(`#${(iteration += 1)}: connected`);
        this.remove();

        yield;
      }
    } finally {
      expect(signal.aborted).toBe(true);

      this.replaceChildren(`#${(iteration += 1)}: disconnected`);
    }
  },
);

const SelfRemovalError = CustomElement.define(
  `x-self-removal-error`,
  {},
  function* () {
    try {
      while (true) {
        this.remove();

        yield;
      }
    } finally {
      throw new Error(`oops`);
    }
  },
);

describe(`CustomElement`, () => {
  let consoleError: SpyInstance;

  beforeEach(() => {
    consoleError = jest.spyOn(console, `error`);
  });

  test(`instantiating`, () => {
    const custom = createElementRef(VariousChildren);

    expect(custom.element).toBeInstanceOf(CustomElement);
    expect(custom.element.nodeName).toBe(`X-VARIOUS-CHILDREN`);
    expect(custom.element.tagName).toBe(`X-VARIOUS-CHILDREN`);
    expect(VariousChildren.tagName).toBe(`X-VARIOUS-CHILDREN`);
  });

  test(`setting various children`, () => {
    const custom = createElementRef(VariousChildren);

    expect(custom.element.childNodes.length).toBe(0);
    expect(custom.element.syntheticChildNodes).toEqual([]);

    <VariousChildren key={custom.key} />;

    expect(custom.element.childNodes.length).toBe(0);
    expect(custom.element.syntheticChildNodes).toEqual([]);

    <VariousChildren key={custom.key}>
      foo
      <a />
      {[`bar`, <div />]}
    </VariousChildren>;

    expect(custom.element.childNodes.length).toBe(0);

    expect(custom.element.syntheticChildNodes).toEqual([
      document.createTextNode(`foo`),
      <a />,
      document.createTextNode(`bar`),
      <div />,
    ]);
  });

  test(`setting various props`, () => {
    const custom = createElementRef(VariousProps);

    expect(custom.element.props).toEqual({b1: false, b2: false});
    expect(Object.keys(custom.element.props)).toEqual([
      `b1`,
      `b2`,
      `n1`,
      `n2`,
      `s1`,
      `s2`,
    ]);

    <VariousProps key={custom.key} b1={false} n1={0} s1="" />;

    expect(custom.element.props).toEqual({b1: false, b2: false, n1: 0, s1: ``});

    expect(Object.keys(custom.element.props)).toEqual([
      `b1`,
      `b2`,
      `n1`,
      `n2`,
      `s1`,
      `s2`,
    ]);

    <VariousProps
      key={custom.key}
      b1={false}
      n1={0}
      s1=""
      b2={undefined}
      n2={undefined}
      s2={undefined}
    />;

    expect(custom.element.props).toEqual({b1: false, b2: false, n1: 0, s1: ``});

    expect(Object.keys(custom.element.props)).toEqual([
      `b1`,
      `b2`,
      `n1`,
      `n2`,
      `s1`,
      `s2`,
    ]);

    <VariousProps
      key={custom.key}
      b1={true}
      n1={1}
      s1="foo"
      b2={true}
      n2={2}
      s2="bar"
    />;

    expect(custom.element.props).toEqual({
      b1: true,
      b2: true,
      n1: 1,
      n2: 2,
      s1: `foo`,
      s2: `bar`,
    });

    expect(Object.keys(custom.element.props)).toEqual([
      `b1`,
      `b2`,
      `n1`,
      `n2`,
      `s1`,
      `s2`,
    ]);
  });

  test(`updating children triggers a synchronous iteration`, () => {
    const custom = createElementRef(ExternalUpdate);
    const a1 = createElementRef(`a`);
    const a2 = createElementRef(`a`);

    <ExternalUpdate key={custom.key}>
      foo
      <a key={a1.key} />
      bar
      <a key={a2.key} />
    </ExternalUpdate>;

    expect(custom.element.textContent).toBe(``);

    document.body.appendChild(custom.element);

    expect(custom.element.textContent).toBe(`#1`);

    <ExternalUpdate key={custom.key}>
      foo
      <a key={a1.key} />
      bar
      <a key={a2.key} />
    </ExternalUpdate>;

    expect(custom.element.textContent).toBe(`#1`);

    <ExternalUpdate key={custom.key}>
      foo
      <a key={a2.key} />
      bar
      <a key={a1.key} />
    </ExternalUpdate>;

    expect(custom.element.textContent).toBe(`#2`);

    <ExternalUpdate key={custom.key}>
      foo
      <a key={a2.key} />
      bar
      <a key={a1.key} />
    </ExternalUpdate>;

    expect(custom.element.textContent).toBe(`#2`);

    <ExternalUpdate key={custom.key}>
      bar
      <a key={a2.key} />
      foo
      <a key={a1.key} />
    </ExternalUpdate>;

    expect(custom.element.textContent).toBe(`#3`);

    <ExternalUpdate key={custom.key}>
      bar
      <a key={a2.key} />
      foo
      <a key={a1.key} />
    </ExternalUpdate>;

    expect(custom.element.textContent).toBe(`#3`);

    <ExternalUpdate key={custom.key}>
      bar
      <a key={a2.key} />
      foo
    </ExternalUpdate>;

    expect(custom.element.textContent).toBe(`#4`);
    expect(consoleError).toHaveBeenCalledTimes(0);
  });

  test(`updating props triggers a synchronous iteration`, () => {
    const custom = createElementRef(ExternalUpdate);

    <ExternalUpdate key={custom.key} n={0} />;

    expect(custom.element.textContent).toBe(``);

    document.body.appendChild(custom.element);

    expect(custom.element.textContent).toBe(`#1`);

    <ExternalUpdate key={custom.key} n={0} />;

    expect(custom.element.textContent).toBe(`#1`);

    <ExternalUpdate key={custom.key} n={undefined} />;

    expect(custom.element.textContent).toBe(`#2`);

    <ExternalUpdate key={custom.key} />;

    expect(custom.element.textContent).toBe(`#2`);

    <ExternalUpdate key={custom.key} n={NaN} />;

    expect(custom.element.textContent).toBe(`#3`);

    <ExternalUpdate key={custom.key} n={NaN} />;

    expect(custom.element.textContent).toBe(`#3`);
    expect(consoleError).toHaveBeenCalledTimes(0);
  });

  test(`calling next triggers an asynchronous iteration`, async () => {
    const custom = createElementRef(InternalUpdate);

    expect(custom.element.textContent).toBe(``);

    document.body.appendChild(custom.element);

    expect(custom.element.textContent).toBe(`#1: 0`);

    custom.element.querySelector(`button`)?.click();
    custom.element.querySelector(`button`)?.click();
    custom.element.querySelector(`button`)?.click();

    expect(custom.element.textContent).toBe(`#1: 0`);

    await Promise.resolve();

    expect(custom.element.textContent).toBe(`#2: 3`);
    expect(consoleError).toHaveBeenCalledTimes(0);
  });

  test(`updating children cancels an already scheduled asynchronous iteration`, async () => {
    const custom = createElementRef(InternalUpdate);

    expect(custom.element.textContent).toBe(``);

    document.body.appendChild(custom.element);

    expect(custom.element.textContent).toBe(`#1: 0`);

    custom.element.querySelector(`button`)?.click();
    custom.element.querySelector(`button`)?.click();
    custom.element.querySelector(`button`)?.click();

    <InternalUpdate key={custom.key}>foo</InternalUpdate>;

    expect(custom.element.textContent).toBe(`#2: 3`);

    await Promise.resolve();

    expect(custom.element.textContent).toBe(`#2: 3`);
    expect(consoleError).toHaveBeenCalledTimes(0);
  });

  test(`ineffective updating of children does not cancel an already scheduled asynchronous iteration`, async () => {
    const custom = createElementRef(InternalUpdate);

    expect(custom.element.textContent).toBe(``);

    document.body.appendChild(custom.element);

    expect(custom.element.textContent).toBe(`#1: 0`);

    custom.element.querySelector(`button`)?.click();
    custom.element.querySelector(`button`)?.click();
    custom.element.querySelector(`button`)?.click();

    <InternalUpdate key={custom.key} />;

    expect(custom.element.textContent).toBe(`#1: 0`);

    await Promise.resolve();

    expect(custom.element.textContent).toBe(`#2: 3`);
    expect(consoleError).toHaveBeenCalledTimes(0);
  });

  test(`disconnecting cancels an already scheduled asynchronous iteration`, async () => {
    const custom = createElementRef(InternalUpdate);

    expect(custom.element.textContent).toBe(``);

    document.body.appendChild(custom.element);

    expect(custom.element.textContent).toBe(`#1: 0`);

    custom.element.querySelector(`button`)?.click();
    custom.element.querySelector(`button`)?.click();
    custom.element.querySelector(`button`)?.click();

    expect(custom.element.textContent).toBe(`#1: 0`);

    custom.element.remove();

    expect(custom.element.textContent).toBe(`#2: 3; disconnected`);

    document.body.appendChild(custom.element);

    expect(custom.element.textContent).toBe(`#1: 0`);

    await Promise.resolve();

    expect(custom.element.textContent).toBe(`#1: 0`);
    expect(consoleError).toHaveBeenCalledTimes(0);
  });

  test(`replacing children does not cause disconnection`, async () => {
    const custom = createElementRef(InternalUpdate);

    expect(custom.element.textContent).toBe(``);

    document.body.appendChild(<InternalUpdate key={custom.key} />);

    expect(custom.element.textContent).toBe(`#1: 0`);

    custom.element.querySelector(`button`)?.click();
    custom.element.querySelector(`button`)?.click();
    custom.element.querySelector(`button`)?.click();

    expect(custom.element.textContent).toBe(`#1: 0`);

    await Promise.resolve();

    expect(custom.element.textContent).toBe(`#2: 3`);

    document.body.replaceChildren(<InternalUpdate key={custom.key} />);

    custom.element.querySelector(`button`)?.click();
    custom.element.querySelector(`button`)?.click();
    custom.element.querySelector(`button`)?.click();

    expect(custom.element.textContent).toBe(`#2: 3`);

    await Promise.resolve();

    expect(custom.element.textContent).toBe(`#3: 6`);
    expect(consoleError).toHaveBeenCalledTimes(0);
  });

  test(`connecting causes an uncaught exception`, () => {
    const custom = createElementRef(InitialError);

    expect(consoleError).toHaveBeenCalledTimes(0);

    document.body.appendChild(custom.element);

    expect(consoleError).toHaveBeenCalledTimes(1);

    expect(consoleError).toHaveBeenNthCalledWith(
      1,
      `uncaught exception in web component:`,
      custom.element,
      new Error(`oops`),
    );
  });

  test(`disconnecting causes an uncaught exception`, () => {
    const custom = createElementRef(IterationError);

    document.body.appendChild(custom.element);

    expect(consoleError).toHaveBeenCalledTimes(0);

    custom.element.remove();

    expect(consoleError).toHaveBeenCalledTimes(1);

    expect(consoleError).toHaveBeenNthCalledWith(
      1,
      `uncaught exception in web component:`,
      custom.element,
      new Error(`oops`),
    );
  });

  test(`updating children causes an uncaught exception`, () => {
    const custom = createElementRef(IterationError);

    document.body.appendChild(custom.element);

    expect(consoleError).toHaveBeenCalledTimes(0);

    <IterationError key={custom.key}>foo</IterationError>;

    expect(consoleError).toHaveBeenCalledTimes(1);

    expect(consoleError).toHaveBeenNthCalledWith(
      1,
      `uncaught exception in web component:`,
      custom.element,
      new Error(`oops`),
    );
  });

  test(`calling next has no effect on a finished generator`, async () => {
    const custom = createElementRef(NoEffect);

    document.body.appendChild(custom.element);

    await Promise.resolve();
  });

  test(`self-removal terminates the generator`, () => {
    const custom = createElementRef(SelfRemoval);

    expect(custom.element.textContent).toBe(``);

    document.body.appendChild(custom.element);

    expect(custom.element.textContent).toBe(`#2: disconnected`);
    expect(consoleError).toHaveBeenCalledTimes(0);
  });

  test(`self-removal causes an uncaught exception`, () => {
    const custom = createElementRef(SelfRemovalError);

    expect(consoleError).toHaveBeenCalledTimes(0);

    document.body.appendChild(custom.element);

    expect(consoleError).toHaveBeenNthCalledWith(
      1,
      `uncaught exception in web component:`,
      custom.element,
      new Error(`oops`),
    );
  });
});
