# redux-bits [![CircleCI](https://circleci.com/gh/cl1ck/redux-bits.svg?style=svg)](https://circleci.com/gh/cl1ck/redux-bits)

A slightly opiniated redux framework with the goal to reduce boilerplate and to modularize
application logic.


## Anatomy of a bit

### Required exports

```javascript
// ./bits/myTestBit.js

// A unique name for the bit.
export const name = 'myTestBit';

// The initial state of the bit.
export const state = {
  foo: true,
  bar: 'someText',
};

// Simplified action creators.
// Just return the payload for redux action.
export const actions = {
  fooAction: foo => !foo,
  barAction: bar => ({ bar: bar.toUpperCase() }),
};

// Simplified reducers.
// Just mutate the draft state, the original will be left untouched.
// Instead of providing the full action only the payload is provided.
// Each action must have one matching reducer with the same name.
export const reducers = {
  fooAction: (draft, payload) => {
    draft.foo = payload;
  },
  barAction: (draft, { bar }) => {
    draft.bar = bar;
  },
};

```


### Optional exports

#### Selectors

```javascript
// ./bits/myTestBit.js
// ...

// Selectors
// For memoized or more complex selectors you might want to use reselect.
export const selectors = {
  fooBar: state => state.foo ? state.bar.toUpperCase() : state.bar.toLowerCase(),
};

```

#### Action types

If the action types are required elsewhere in your application you may export them using an included
helper function:

```javascript
// ./bits/myTestBit.js
import { actionTypes } from 'redux-bits';
// ...

export const types = actionTypes(actions);

```

#### React state container

Export state container as default:

```javascript
// ./bits/myTestBit.js
import { actionTypes } from 'redux-bits';
// ...

export default createContainer(name, actions, selector /*optional*/);

```

## Usage

Use `createStore` from `redux-bits` to create your redux store instead of using the original
one from `redux`.

You may add any third party reducers, middlewares and/or store enhancers.

```javascript
// store.js
import { createStore } from 'redux-bits';
import * as myTestBit from './bits/myTestBit';

// all options are optional
const config = {
  bits: [myTestBit],
  reducers: {},
  middlewares: [],
  enhancers: [],
  initialState: {},
};

export default createStore(config);
```

## Usage with React

To use bits with react, export the state container from the bit (see above).
You may then access the bit state using render props:

```javascript
// ./testComponent.js
import React from 'react'
import MyTestBit from 'bits/myTestBit'

export default () => (
<div>
  <MyTestBit>
    {({ foo, bar, fooAction }) => (
      <p>Foo: {foo}</p>
      <p>Bar: {bar}</p>
      <a onClick={fooAction}>Foo action</a>
    )}
  </MyTestBit>
</div>
);

```

### Use selectors to optimize render performance of your components

#### Bit selectors

Selectors that are defined in the corresponding bit may be used by setting the `selector` prop to
the selector's name.

```javascript
// ./fooComponent.js
import React from 'react'
import MyTestBit from 'bits/myTestBit';

export default () => (
<div>
  <MyTestBit selector='fooBar'>
    {({ fooBar, fooAction }) => (
      <p>Foo: {fooBar}</p>
      <a onClick={fooAction}>action creators are still available</a>
    )}
  </MyTestBit>
</div>
);

```

#### Custom selectors

You may use any selector function as `selector` prop.
In addition to the globalState the bit's state is provided as second parameter.

```javascript
// ./barComponent.js
import React from 'react'
import MyTestBit from 'bits/myTestBit';

export default () => (
<div>
  <MyTestBit selector={(globalState, bitState) => ({
    globalValue: globalState.someGlobalValue,
    bar: bitState.bar,
  })}>
    {({ bar, globalValue }) => (
      <p>Bar: {bar}</p>
      <p>Global value: {globalValue}</p>
    )}
  </MyTestBit>
</div>
);

```
