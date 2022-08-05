export class Subject {
  #currentController: AbortController | undefined;

  get currentSignal(): AbortSignal {
    if (!this.#currentController) {
      this.#currentController = new AbortController();
    }

    return this.#currentController.signal;
  }

  protected abort(): void {
    if (this.#currentController) {
      const currentController = this.#currentController;
      this.#currentController = undefined;
      currentController.abort();
    }
  }
}
