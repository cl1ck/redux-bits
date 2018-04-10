import snakeCase from 'snake-case';

export const getTypeFromAction = (name, action) => (
  `${name}/${snakeCase(action).toUpperCase()}`
);

export const buildActionTypes = (name, actions) => Object.keys(actions)
  .reduce((acc, action) => Object.assign(acc, {
    [action]: getTypeFromAction(name, action),
  }), {});

export const buildActionCreator = (bitName, actionName, action) => {
  // simple action creator
  if (action === null) {
    return () => ({
      type: getTypeFromAction(bitName, actionName)
    })
  }
  
  // action creator with payload
  return (...args)  => ({
    type: getTypeFromAction(bitName, actionName),
    payload: action(...args),
  });
};

export const buildActionCreators = (bitName, actions) => Object.keys(actions)
  .reduce((acc, actionName) => Object.assign(acc, {
    [actionName]: buildActionCreator(bitName, actionName, actions[actionName]),
  }), {});
