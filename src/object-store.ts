import {Store} from './store.js';

export interface ObjectStoreInit<TValue extends object> {
  readonly storage: Pick<Storage, 'getItem' | 'setItem'>;
  readonly key: string;
  readonly defaultValue: TValue;
}

export class ObjectStore<TValue extends object> extends Store<TValue> {
  readonly #storage: Pick<Storage, 'getItem' | 'setItem'>;
  readonly #key: string;

  constructor(init: ObjectStoreInit<TValue>) {
    const {storage, key, defaultValue} = init;
    const item = storage.getItem(key);
    const value = item ? JSON.parse(item) : defaultValue;

    super(value);

    this.#storage = storage;
    this.#key = key;
  }

  override get value(): TValue {
    return super.value;
  }

  override set value(value: TValue) {
    this.#storage.setItem(this.#key, JSON.stringify((super.value = value)));
  }
}
