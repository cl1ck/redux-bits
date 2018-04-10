import { combineBitsAndReducers } from '../src/createStore';
import createTestBit from './createTestBit';

describe('combineBitsAndReducers', () => {
  it('correctly combines bits and reducers', () => {
    const bit1 = createTestBit('test1');
    const bit2 = createTestBit('test2');
    const reducer = (draft = { test: 'test' }, action) => {
      if (action.type === 'test') {
        draft.test = action.payload;
      }
      return draft;
    };
    const combinedReducer = combineBitsAndReducers([
      bit1,
      bit2,
    ], {
      test3: reducer,
    });
    expect(combinedReducer).toBeInstanceOf(Function);
    const initState = combinedReducer(undefined, '@@@INIT');
    expect(initState).toEqual({
      test1: bit1.state,
      test2: bit2.state,
      test3: {
        test: 'test',
      },
    });
  });
});
