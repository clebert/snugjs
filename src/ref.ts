export function ref<TElement extends JSX.Element>(
  callback: (key: object) => JSX.Element,
): () => TElement {
  const key = {};

  return () => callback(key) as TElement;
}
