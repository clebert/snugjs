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
