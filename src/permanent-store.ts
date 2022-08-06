import {Store} from './store.js';

export interface PermanentStoreInit<TValue> {
  readonly storage: Pick<Storage, 'getItem' | 'setItem'>;
  readonly key: string;
  readonly defaultValue: NonNullable<TValue>;
}

export class PermanentStore<TValue> extends Store<NonNullable<TValue>> {
  readonly #storage: Pick<Storage, 'getItem' | 'setItem'>;
  readonly #key: string;

  constructor(init: PermanentStoreInit<TValue>) {
    const {storage, key, defaultValue} = init;
    const item = storage.getItem(key);
    const value = item ? JSON.parse(item) : defaultValue;

    super(value);

    this.#storage = storage;
    this.#key = key;
  }

  override get value(): NonNullable<TValue> {
    return super.value;
  }

  override set value(value: NonNullable<TValue>) {
    this.#storage.setItem(this.#key, JSON.stringify((super.value = value)));
  }
}
