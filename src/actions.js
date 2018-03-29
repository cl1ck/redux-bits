import snakeCase from 'snake-case';

export const buildActionCreators = (actions, types) => Object.keys(actions)
  .map(actionName => ({
    actionName,
    creator: (...params) => ({
      type: types[actionName],
      payload: actions[actionName](...params),
    }),
  }))
  .reduce((acc, actionList) => Object.assign(acc, {
    [actionList.actionName]: actionList.creator,
  }), {});

export const getTypeFromAction =
  (name, action) => `${name}/${snakeCase(action).toUpperCase()}`;

export const buildActionTypes = (name, actions) => Object.keys(actions)
  .reduce((acc, action) => Object.assign(acc, {
    [action]: getTypeFromAction(name, action),
  }), {});

export const buildActions = (name, actions) => {
  const types = buildActionTypes(name, actions);
  const actionCreators = buildActionCreators(actions, types);
  return {
    actions: actionCreators,
    types,
  };
};
