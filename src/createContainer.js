import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import produce from 'immer';
import { buildActionCreators } from './actions';

export const createMapStateToProps = (name, selectors = {}) => (state, { selector }) => {
  const bitSelector = state => state[name];
  const bitState = bitSelector(state);

  if (typeof selector === 'undefined') {
    // no selector
    return bitState;
  } else if (typeof selector === 'string') {
    // bit selector
    if (!selectors[selector]) {
      throw new Error(`Requested selector ${selector} is not defined!`);
    }

    // bit selectors receive the bit state as first parameter
    const selectedState = selectors[selector](bitState, state);
    return {
      [selector]: selectedState,
    };
    return selectedState;
  } else if (typeof selector === 'function') {
    // custom selector receive global state as first parameter
    return selector(state, bitState);
  }
  throw new Error('If the selector prop is defined it must either be the name of a bit ' +
    'selector or a selector function!');
};

const FAACContainer = ({ children, ...rest }) => children(rest);
FAACContainer.propTypes = {
  children: PropTypes.func.isRequired,
};

const ComponentContainer = ({ Component, ...rest}) => (
  <Component {...rest} />
);

export const createContainer = (name, actions, selectors = {}, Container = FAACContainer) => {
  const actionCreators = buildActionCreators(name, actions);
  const mapStateToProps = createMapStateToProps(name, selectors);
  const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch);

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Container);
};

export const createComponentContainer = (name, actions, selectors = {}) =>
  createContainer(name, actions, selectors, ComponentContainer);
