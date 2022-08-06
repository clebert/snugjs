export function race(...signals: readonly AbortSignal[]): AbortSignal {
  const controller = new AbortController();

  for (const signal of signals) {
    if (signal.aborted) {
      throw new Error(`Signal already aborted.`);
    }

    signal.addEventListener(`abort`, () => controller.abort(signal.reason), {
      signal: controller.signal,
    });
  }

  return controller.signal;
}
