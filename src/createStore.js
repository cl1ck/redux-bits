import { createStore as createReduxStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools, devToolsEnhancer } from 'redux-devtools-extension';
import { createBitReducer, createImmutableReducer } from './reducer';
import validateBit from './validateBit';

export const combineBitsAndReducers = (bits = [], reducers = {}) => {
  const reducerList = {};
  bits.forEach((bit) => {
    validateBit(bit);
    if (reducerList[bit.name]) {
      throw new Error(`Found two bits with the same name '${bit.name}'`);
    }
    reducerList[bit.name] = createBitReducer(bit.name, bit.reducers, bit.state);
  });
  Object.entries(reducers).forEach(([key, reducer]) => {
    if (reducerList[key]) {
      throw new Error(`Found duplicate reducer named ${key}`);
    }
    reducerList[key] = createImmutableReducer(reducer);
  });

  return combineReducers(reducerList);
};

export const createStore = ({
  bits = [],
  reducers = {},
  middlewares = [],
  enhancers = [],
  initialState = {},
}) => {
  if (bits.length < 1 && Object.keys(reducers).length < 1) {
    throw new Error('createStore expects at least one bit or reducer!');
  }

  const reducer = combineBitsAndReducers(bits, reducers);

  // enhancers
  let enhancer;
  const finalEnhancers = [];
  if (middlewares.length > 0) {
    finalEnhancers.push(applyMiddleware(...middlewares));
  }
  if (enhancers.length > 0) {
    finalEnhancers.push(...enhancers);
  }
  if (finalEnhancers.length > 0) {
    enhancer = composeWithDevTools(...finalEnhancers);
  } else {
    enhancer = devToolsEnhancer;
  }

  const store = createReduxStore(
    reducer,
    initialState,
    enhancer,
  );

  store.originalReplaceReducer = store.replaceReducer;
  store.replaceReducer = () => {
    throw new Error('Use replaceBits() instead.');
  };
  store.replaceBits = (nextBits = {}, nextReducers = {}) => {
    const nextReducer = combineBitsAndReducers(nextBits, nextReducers);
    store.originalReplaceReducer(nextReducer);
  };

  return store;
};
