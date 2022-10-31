# snugjs

> Create reactive web components using generator functions.

## Installation

```
npm install snugjs
```

## Example

```jsx
import {createElement} from '@snugjs/html';
import {CustomElement, createElementRef} from 'snugjs';

export const Counter = CustomElement.define(
  `x-counter`,
  {initialCount: `number?`},
  function* ({next, signal}) {
    const decrementButton = createElementRef(`button`);
    const incrementButton = createElementRef(`button`);

    let count = this.props.initialCount ?? 0;

    decrementButton.element.addEventListener(
      `click`,
      () => {
        count -= 1;
        next();
      },
      {signal},
    );

    incrementButton.element.addEventListener(
      `click`,
      () => {
        count += 1;
        next();
      },
      {signal},
    );

    while (true) {
      this.replaceChildren(
        <button key={decrementButton.key}>-</button>,
        <button key={incrementButton.key}>+</button>,
        <b>{count}</b>,
      );

      yield;
    }
  },
);
```

```jsx
document.body.appendChild(<Counter initialCount={42} />);
```

```html
<html>
  <body>
    <x-counter initialCount="42"></x-counter>
  </body>
</html>
```
