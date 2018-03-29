'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildActions = exports.buildActionTypes = exports.getTypeFromAction = exports.buildActionCreators = undefined;

var _snakeCase = require('snake-case');

var _snakeCase2 = _interopRequireDefault(_snakeCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var buildActionCreators = exports.buildActionCreators = function buildActionCreators(actions, types) {
  return Object.keys(actions).map(function (actionName) {
    return {
      actionName: actionName,
      creator: function creator() {
        return {
          type: types[actionName],
          payload: actions[actionName].apply(actions, arguments)
        };
      }
    };
  }).reduce(function (acc, actionList) {
    return Object.assign(acc, _defineProperty({}, actionList.actionName, actionList.creator));
  }, {});
};

var getTypeFromAction = exports.getTypeFromAction = function getTypeFromAction(name, action) {
  return name + '/' + (0, _snakeCase2.default)(action).toUpperCase();
};

var buildActionTypes = exports.buildActionTypes = function buildActionTypes(name, actions) {
  return Object.keys(actions).reduce(function (acc, action) {
    return Object.assign(acc, _defineProperty({}, action, getTypeFromAction(name, action)));
  }, {});
};

var buildActions = exports.buildActions = function buildActions(name, actions) {
  var types = buildActionTypes(name, actions);
  var actionCreators = buildActionCreators(actions, types);
  return {
    actions: actionCreators,
    types: types
  };
};