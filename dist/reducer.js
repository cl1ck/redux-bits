'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createImmutableReducer = exports.createBitReducer = undefined;

var _immer = require('immer');

var _immer2 = _interopRequireDefault(_immer);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createBitReducer = exports.createBitReducer = function createBitReducer(name, reducers) {
  var initialState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var actionTypes = (0, _actions.buildActionTypes)(name, reducers);
  var actions = Object.keys(actionTypes).reduce(function (acc, actionType) {
    return Object.assign(acc, _defineProperty({}, actionTypes[actionType], actionType));
  }, {});

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];
    return (0, _immer2.default)(state, function (draft) {
      if (action.type && actions[action.type] && reducers[actions[action.type]]) {
        reducers[actions[action.type]](draft, action.payload);
      }
    });
  };
};

var createImmutableReducer = exports.createImmutableReducer = function createImmutableReducer(reducer) {
  return function (state, action) {
    for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      params[_key - 2] = arguments[_key];
    }

    return (0, _immer2.default)(state, function (draft) {
      return reducer.apply(undefined, [draft, action].concat(params));
    });
  };
};