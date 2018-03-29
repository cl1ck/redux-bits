import React from 'react';
import createContainer, { createMapStateToProps } from '../src/createContainer';
import createTestBit from './createTestBit';

const testBit = createTestBit('test');
const {
  state,
  actions,
  selectors,
  name,
} = testBit;
const testState = {
  [name]: state,
  globalValue: 'global',
};
const mapStateToProps = createMapStateToProps(name, selectors);

describe('createMapStateToProps', () => {
  it('accepts predefined selectors', () => {
    const props = {
      selector: 'text',
    };
    expect(mapStateToProps(testState, props)).toEqual({
      text: 'test',
    });
  });

  it('accepts no selector', () => {
    expect(mapStateToProps(testState, {})).toEqual(testState[name]);
  });

  it('accepts custom selectors with access to global state', () => {
    const props = {
      selector: state => ({ globalValue: state.globalValue }),
    };
    expect(mapStateToProps(testState, props)).toEqual({
      globalValue: 'global',
    });
  });

  it('accepts custom selectors with access to local state', () => {
    const props = {
      selector: (state, bitState) => ({
        listLength: bitState.list.length,
      }),
    };
    expect(mapStateToProps(testState, props)).toEqual({
      listLength: 2,
    });
  });

  it('does not accept invalid selectors', () => {
    const props = {
      selector: ['array'],
    };
    expect(() => mapStateToProps(testState, props)).toThrow();
  });
});

describe('createContainer', () => {
  it('provides state to children', () => {
    const store = createMockStore(testState);
    const Container = createContainer(name, actions);
    const component = mountWithStore(
      <Container>
        {({ text }) => (
          <div id="test">{text}</div>
        )}
      </Container>,
      store,
    );
    expect(component.find('#test').text()).toBe('test');
  });

  it('provides action creators to children', () => {
    const store = createMockStore(testState);
    const Container = createContainer(name, actions);
    const component = mountWithStore(
      <Container>
        {({ testAction }) => (
          <button id="test" onClick={testAction(true)} />
        )}
      </Container>,
      store,
    );
    component.find('#test').simulate('click');
    const executedActions = store.getActions();
    expect(executedActions).toHaveLength(1);
    expect(executedActions[0]).toEqual(actions.testAction(true));
  });

  it('accepts bit selectors', () => {
    const store = createMockStore(testState);
    const Container = createContainer(name, actions, selectors);
    const component = mountWithStore(
      <Container selector='text'>
        {({ text }) => (
          <div id="test">{text}</div>
        )}
      </Container>,
      store,
    );
    expect(component.find('#test').text()).toBe('test');
  });

  it('accepts custom selectors with access to global state', () => {
    const store = createMockStore(testState);
    const Container = createContainer(name, actions, selectors);
    const component = mountWithStore(
      <Container selector={state => ({
        text: state.globalValue,
      })}>
        {({ text }) => (
          <div id="test">{text}</div>
        )}
      </Container>,
      store,
    );
    expect(component.find('#test').text()).toBe('global');
  });


  it('accepts custom selectors with access to bit state', () => {
    const store = createMockStore(testState);
    const Container = createContainer(name, actions, selectors);
    const component = mountWithStore(
      <Container selector={(state, bitState) => ({
        text: bitState.text,
      })}>
        {({ text }) => (
          <div id="test">{text}</div>
        )}
      </Container>,
      store,
    );
    expect(component.find('#test').text()).toBe('test');
  });
});
