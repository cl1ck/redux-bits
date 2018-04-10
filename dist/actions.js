'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildActionCreators = exports.buildActionCreator = exports.buildActionTypes = exports.getTypeFromAction = undefined;

var _snakeCase = require('snake-case');

var _snakeCase2 = _interopRequireDefault(_snakeCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getTypeFromAction = exports.getTypeFromAction = function getTypeFromAction(name, action) {
  return name + '/' + (0, _snakeCase2.default)(action).toUpperCase();
};

var buildActionTypes = exports.buildActionTypes = function buildActionTypes(name, actions) {
  return Object.keys(actions).reduce(function (acc, action) {
    return Object.assign(acc, _defineProperty({}, action, getTypeFromAction(name, action)));
  }, {});
};

var buildActionCreator = exports.buildActionCreator = function buildActionCreator(bitName, actionName, action) {
  // simple action creator
  if (action === null) {
    return function () {
      return {
        type: getTypeFromAction(bitName, actionName)
      };
    };
  }

  // action creator with payload
  return function () {
    return {
      type: getTypeFromAction(bitName, actionName),
      payload: action.apply(undefined, arguments)
    };
  };
};

var buildActionCreators = exports.buildActionCreators = function buildActionCreators(bitName, actions) {
  return Object.keys(actions).reduce(function (acc, actionName) {
    return Object.assign(acc, _defineProperty({}, actionName, buildActionCreator(bitName, actionName, actions[actionName])));
  }, {});
};