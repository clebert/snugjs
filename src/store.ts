import {Subject} from './subject.js';

export class Store<TValue> extends Subject {
  #value: TValue;

  constructor(value: TValue) {
    super();

    this.#value = value;
  }

  get value(): TValue {
    return this.#value;
  }

  set value(value: TValue) {
    this.#value = value;
    this.abort();
  }
}
