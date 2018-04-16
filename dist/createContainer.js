'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createComponentContainer = exports.createContainer = exports.createMapStateToProps = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _immer = require('immer');

var _immer2 = _interopRequireDefault(_immer);

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createMapStateToProps = exports.createMapStateToProps = function createMapStateToProps(name) {
  var selectors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (state, _ref) {
    var selector = _ref.selector;

    var bitSelector = function bitSelector(state) {
      return state[name];
    };
    var bitState = bitSelector(state);

    if (typeof selector === 'undefined') {
      // no selector
      return bitState;
    } else if (typeof selector === 'string') {
      // bit selector
      if (!selectors[selector]) {
        throw new Error('Requested selector ' + selector + ' is not defined!');
      }

      // bit selectors receive the bit state as first parameter
      var selectedState = selectors[selector](bitState, state);
      return _defineProperty({}, selector, selectedState);
      return selectedState;
    } else if (typeof selector === 'function') {
      // custom selector receive global state as first parameter
      return selector(state, bitState);
    }
    throw new Error('If the selector prop is defined it must either be the name of a bit ' + 'selector or a selector function!');
  };
};

var FAACContainer = function FAACContainer(_ref3) {
  var children = _ref3.children,
      rest = _objectWithoutProperties(_ref3, ['children']);

  return children(rest);
};
FAACContainer.propTypes = {
  children: _propTypes2.default.func.isRequired
};

var ComponentContainer = function ComponentContainer(_ref4) {
  var Component = _ref4.Component,
      rest = _objectWithoutProperties(_ref4, ['Component']);

  return _react2.default.createElement(Component, rest);
};

var createContainer = exports.createContainer = function createContainer(name, actions) {
  var selectors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var Container = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : FAACContainer;

  var actionCreators = (0, _actions.buildActionCreators)(name, actions);
  var mapStateToProps = createMapStateToProps(name, selectors);
  var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return (0, _redux.bindActionCreators)(actionCreators, dispatch);
  };

  return (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Container);
};

var createComponentContainer = exports.createComponentContainer = function createComponentContainer(name, actions) {
  var selectors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return createContainer(name, actions, selectors, ComponentContainer);
};