import { isFSA } from 'flux-standard-action';
import snakeCase from 'snake-case';
import {
  getTypeFromAction,
  buildActionCreators,
  buildActionTypes,
  buildActions,
} from '../src/actions';

const actions = {
  testAction: success => success,
  action2: success => !success,
};
const types = {
  testAction: 'test/TEST_ACTION',
  action2: 'test/ACTION2',
};

describe('buildActionTypes', () => {
  it('names action types correctly', () => {
    const actionTypes = buildActionTypes('test', actions);
    expect(actionTypes).toEqual(types);
  });
});

describe('buildActionCreators', () => {
  it('maps out action creators correctly', () => {
    const actionCreators = buildActionCreators(actions, types);
    expect(actionCreators).toEqual({
      testAction: expect.any(Function),
      action2: expect.any(Function),
    });
  });

  it('builds action creators that create flux standard actions', () => {
    const actionCreators = buildActionCreators(actions, types);
    expect(isFSA(actionCreators.testAction(true))).toBe(true);
    expect(isFSA(actionCreators.action2(true))).toBe(true);
  });


  it('builds action creators that create the expected actions', () => {
    const actionCreators = buildActionCreators(actions, types);
    expect(actionCreators.testAction(true)).toEqual({
      type: types.testAction,
      payload: true,
    });
    expect(actionCreators.action2(true)).toEqual({
      type: types.action2,
      payload: false,
    });
  });
});

describe('buildActions', () => {
  it('builds valid actions and action creators', () => {
    const result = buildActions('test', actions);
    expect(result).toEqual({
      actions: {
        testAction: expect.any(Function),
        action2: expect.any(Function),
      },
      types,
    });
    expect(result.actions.testAction(true)).toEqual({
      type: result.types.testAction,
      payload: true,
    });
    expect(result.actions.action2(true)).toEqual({
      type: result.types.action2,
      payload: false,
    });
  });
});

describe('getTypeFromAction', () => {
  it('combines bit name and snake case action name', () => {
    expect(getTypeFromAction('test', 'myTestAction'))
      .toBe(`test/${snakeCase('myTestAction').toUpperCase()}`);
  });
});
