import produce from 'immer';
import { buildActionTypes } from './actions';

export const createBitReducer = (name, reducers, initialState = {}) => {
  const actionTypes = buildActionTypes(name, reducers);
  const actions = Object.keys(actionTypes).reduce((acc, actionType) => Object.assign(acc, {
    [actionTypes[actionType]]: actionType,
  }), {});
  return (state = initialState, action) => produce(state, (draft) => {
    if (action.type && action.payload && actions[action.type] && reducers[actions[action.type]]) {
      reducers[actions[action.type]](draft, action.payload);
    }
  });
};

export const createImmutableReducer = reducer => (state, action, ...params) => produce(
  state,
  draft => reducer(draft, action, ...params),
);
