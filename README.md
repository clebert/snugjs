# snugjs

> Create reactive web components using generators and signals.

**⚠️ This is an experimental software.**

## Installation

```
npm install snugjs
```

## Rationale

The design philosophy behind snugjs is to provide the most straightforward
possible mechanics to utilize native web components without external
dependencies. No Virtual DOM or compiler is needed to write a website. The DOM
API is not abstracted but used directly. No compromise on TypeScript or JSX
support. The use of generator functions allows native control-flow statements
such as `try`-`catch`-`finally`, `yield`, `await`, or `while` to map the
lifecycle of a component. Due to its small size (currently < 1.5 kB), snugjs is
suitable for both SPAs and MPAs.

## Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Counter</title>
  </head>
  <body>
    <x-counter></x-counter>
  </body>
</html>
```

```jsx
import {CustomElement, PermanentStore, h, race} from 'snugjs';

export const Counter = CustomElement.define(
  `x-counter`,
  function* ({activeSignal}) {
    const count = new PermanentStore({
      storage: localStorage,
      key: `x-count`,
      defaultValue: 0,
    });

    const decrementButtonElement = (<button>-</button>) as HTMLButtonElement;
    const incrementButtonElement = (<button>+</button>) as HTMLButtonElement;

    decrementButtonElement.addEventListener(`click`, () => (count.value -= 1), {
      signal: activeSignal,
    });

    incrementButtonElement.addEventListener(`click`, () => (count.value += 1), {
      signal: activeSignal,
    });

    while (!activeSignal.aborted) {
      const activeElement = document.activeElement;

      this.replaceChildren(
        decrementButtonElement,
        incrementButtonElement,
        <span>{count.value}</span>,
      );

      if (activeElement instanceof HTMLElement && activeElement.isConnected) {
        activeElement.focus();
      }

      yield () => race(activeSignal, count.currentSignal);
    }
  },
);
```
