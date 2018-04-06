// import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import produce from 'immer';

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

const createContainer = (name, actions, selectors = {}) => {
  const Container = props => props.children(props);
  Container.propTypes = {
    children: PropTypes.func.isRequired,
  };
  
  const mapStateToProps = createMapStateToProps(name, selectors);
  const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Container);
};

export default createContainer;
