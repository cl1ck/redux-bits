'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMapStateToProps = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // import React from 'react';


var _reactRedux = require('react-redux');

var _redux = require('redux');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _immer = require('immer');

var _immer2 = _interopRequireDefault(_immer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
      if ((typeof selectedState === 'undefined' ? 'undefined' : _typeof(selectedState)) !== 'object') {
        return _defineProperty({}, selector, selectedState);
      }
      return selectedState;
    } else if (typeof selector === 'function') {
      // custom selector receive global state as first parameter
      return selector(state, bitState);
    }
    throw new Error('If the selector prop is defined it must either be the name of a bit ' + 'selector or a selector function!');
  };
};

var createContainer = function createContainer(name, actions) {
  var selectors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var Container = function Container(props) {
    return props.children(props);
  };
  Container.propTypes = {
    children: _propTypes2.default.func.isRequired
  };

  var mapStateToProps = createMapStateToProps(name, selectors);
  var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return (0, _redux.bindActionCreators)(actions, dispatch);
  };

  return (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Container);
};

exports.default = createContainer;