export class Subject {
  #currentController = new AbortController();
  #nextController = new AbortController();

  get currentSignal(): AbortSignal {
    return this.#currentController.signal;
  }

  get nextSignal(): AbortSignal {
    return this.#nextController.signal;
  }

  abort(): void {
    const previousController = this.#currentController;
    this.#currentController = this.#nextController;
    this.#nextController = new AbortController();
    previousController.abort();
  }
}
