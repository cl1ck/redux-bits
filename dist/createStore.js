'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = exports.combineBitsAndReducers = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _redux = require('redux');

var _reduxDevtoolsExtension = require('redux-devtools-extension');

var _reducer = require('./reducer');

var _validateBit = require('./validateBit');

var _validateBit2 = _interopRequireDefault(_validateBit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var combineBitsAndReducers = exports.combineBitsAndReducers = function combineBitsAndReducers() {
  var bits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var reducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var reducerList = {};
  bits.forEach(function (bit) {
    (0, _validateBit2.default)(bit);
    if (reducerList[bit.name]) {
      throw new Error('Found two bits with the same name \'' + bit.name + '\'');
    }
    reducerList[bit.name] = (0, _reducer.createBitReducer)(bit.name, bit.reducers, bit.state);
  });
  Object.entries(reducers).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        reducer = _ref2[1];

    if (reducerList[key]) {
      throw new Error('Found duplicate reducer named ' + key);
    }
    reducerList[key] = (0, _reducer.createImmutableReducer)(reducer);
  });

  return (0, _redux.combineReducers)(reducerList);
};

var createStore = exports.createStore = function createStore(_ref3) {
  var _ref3$bits = _ref3.bits,
      bits = _ref3$bits === undefined ? [] : _ref3$bits,
      _ref3$reducers = _ref3.reducers,
      reducers = _ref3$reducers === undefined ? {} : _ref3$reducers,
      _ref3$middlewares = _ref3.middlewares,
      middlewares = _ref3$middlewares === undefined ? [] : _ref3$middlewares,
      _ref3$enhancers = _ref3.enhancers,
      enhancers = _ref3$enhancers === undefined ? [] : _ref3$enhancers,
      _ref3$initialState = _ref3.initialState,
      initialState = _ref3$initialState === undefined ? {} : _ref3$initialState;

  if (bits.length < 1 && Object.keys(reducers).length < 1) {
    throw new Error('createStore expects at least one bit or reducer!');
  }

  var reducer = combineBitsAndReducers(bits, reducers);

  // enhancers
  var enhancer = void 0;
  var finalEnhancers = [];
  if (middlewares.length > 0) {
    finalEnhancers.push(_redux.applyMiddleware.apply(undefined, _toConsumableArray(middlewares)));
  }
  if (enhancers.length > 0) {
    finalEnhancers.push.apply(finalEnhancers, _toConsumableArray(enhancers));
  }
  if (finalEnhancers.length > 0) {
    enhancer = _reduxDevtoolsExtension.composeWithDevTools.apply(undefined, finalEnhancers);
  } else {
    enhancer = _reduxDevtoolsExtension.devToolsEnhancer;
  }

  var store = (0, _redux.createStore)(reducer, initialState, enhancer);

  store.originalReplaceReducer = store.replaceReducer;
  store.replaceReducer = function () {
    throw new Error('Use replaceBits() instead.');
  };
  store.replaceBits = function () {
    var nextBits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var nextReducers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var nextReducer = combineBitsAndReducers(nextBits, nextReducers);
    store.originalReplaceReducer(nextReducer);
  };

  return store;
};