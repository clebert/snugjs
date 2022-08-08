/**
 * @jest-environment jsdom
 */

import {describe, expect, test} from '@jest/globals';
import {Subject} from './subject.js';

describe(`Subject`, () => {
  test(`the current signal is replaced by the next one`, () => {
    const subject = new Subject();
    const {currentSignal, nextSignal: nextSignal1} = subject;

    subject.abort();

    expect(currentSignal.aborted).toBe(true);
    expect(currentSignal).not.toBe(subject.currentSignal);
    expect(currentSignal).not.toBe(subject.nextSignal);
    expect(nextSignal1.aborted).toBe(false);
    expect(nextSignal1).toBe(subject.currentSignal);
    expect(nextSignal1).not.toBe(subject.nextSignal);

    const {nextSignal: nextSignal2} = subject;

    subject.abort();

    expect(nextSignal1.aborted).toBe(true);
    expect(nextSignal1).not.toBe(subject.currentSignal);
    expect(nextSignal1).not.toBe(subject.nextSignal);
    expect(nextSignal2.aborted).toBe(false);
    expect(nextSignal2).toBe(subject.currentSignal);
    expect(nextSignal2).not.toBe(subject.nextSignal);
  });

  test(`the current and next signal are never stale`, (done) => {
    const subject = new Subject();
    const {nextSignal} = subject;

    subject.currentSignal.addEventListener(`abort`, () => {
      try {
        expect(nextSignal).toBe(subject.currentSignal);
        done();
      } catch (error) {
        done(error as Error);
      }
    });

    subject.abort();
  });
});
