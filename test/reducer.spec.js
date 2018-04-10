import { createImmutableReducer, createBitReducer } from '../src/reducer';
import createTestBit from './createTestBit';

const testBit = createTestBit('test');
const targetState = {
  success: true,
  list: [
    { value: 'someChangedValue' },
    { value: 'someOtherValue' },
    { value: 'someNewValue' },
  ],
  staticValue: 'static',
  text: 'test',
};
const testAction = {
  type: 'test/ACTION2',
  payload: true,
};

let reducer;

describe('createBitReducer', () => {
  beforeEach(() => {
    reducer = createBitReducer('test', testBit.reducers, testBit.state);
  });

  test('returns a function', () => {
    expect(reducer).toBeInstanceOf(Function);
  });

  test('works correctly with mapped actions', () => {
    const reducedState = reducer(testBit.state, testAction);
    expect(reducedState).toEqual(targetState);
  });

  test('does not modify given state', () => {
    expect(() => reducer(testBit.state, testAction)).not.toThrow();
  });

  test('uses "immer" immutable state as expected', () => {
    const reducedState = reducer(testBit.state, testAction);
    expect(testBit.state.list).toHaveLength(2);
    expect(reducedState.list).toHaveLength(3);
    expect(testBit.state.list[0].value).toBe('someValue');
    expect(reducedState.list[0].value).toBe('someChangedValue');
    expect(testBit.state.success).toBe(false);
    expect(reducedState.success).toBe(true);
    expect(reducedState.list[1]).toBe(testBit.state.list[1]);
    expect(reducedState.list[0]).not.toBe(testBit.state.list[0]);
  });

  test('reduced state is immutable', () => {
    const reducedState = reducer(testBit.state, testAction);
    expect(() => {
      reducedState.success = false;
    }).toThrow();
    expect(() => {
      reducedState.list.push({ value: 'error' });
    }).toThrow();
    expect(() => {
      reducedState.list[0].value = 'error';
    }).toThrow();
  });

  test('unmapped actions are ignored', () => {
    const invalidAction = {
      type: 'someOtherType',
      payload: true,
    };
    const invalidAction2 = {
      type: 'withoutPayload',
    };
    expect(reducer(testBit.state, invalidAction)).toBe(testBit.state);
    expect(reducer(testBit.state, invalidAction2)).toBe(testBit.state);
  });
});

let immutableReducer;
const initialState = { test: 'someValue' };
describe('createImmutableReducer', () => {
  beforeEach(() => {
    const testReducer = (draft = initialState, action) => {
      if (action.type === 'test') {
        draft.test = action.payload;
      }
      return draft;
    };
    immutableReducer = createImmutableReducer(testReducer);
  });

  it('correctly returns initialState', () => {
    const nextState = immutableReducer(undefined, '@@@INIT');
    expect(nextState).toBe(initialState);
  });

  it('does not mutate the original state', () => {
    const nextState = immutableReducer(initialState, {
      type: 'test',
      payload: 'someNewValue',
    });
    expect(initialState).toEqual({
      test: 'someValue',
    });
    expect(nextState).toEqual({
      test: 'someNewValue',
    });
  });
});
