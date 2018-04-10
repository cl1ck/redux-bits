import { isFSA } from 'flux-standard-action';
import snakeCase from 'snake-case';
import {
  getTypeFromAction,
  buildActionTypes,
  buildActionCreator,
  buildActionCreators,
} from '../src/actions';

const name = 'test';
const actions = {
  testAction: success => success,
  action2: success => !success,
  nullAction: null,
};
const types = {
  testAction: 'test/TEST_ACTION',
  action2: 'test/ACTION2',
  nullAction: 'test/NULL_ACTION',
};

describe('buildActionTypes', () => {
  it('names action types correctly', () => {
    const actionTypes = buildActionTypes(name, actions);
    expect(actionTypes).toEqual(types);
  });
});

describe('buildActionCreators', () => {
  it('maps out action creators correctly', () => {
    const actionCreators = buildActionCreators(name, actions);
    expect(actionCreators).toEqual({
      testAction: expect.any(Function),
      action2: expect.any(Function),
      nullAction: expect.any(Function),
    });
  });

  it('builds action creators that create flux standard actions', () => {
    const actionCreators = buildActionCreators(name, actions);
    expect(isFSA(actionCreators.testAction(true))).toBe(true);
    expect(isFSA(actionCreators.action2(true))).toBe(true);
    expect(isFSA(actionCreators.nullAction())).toBe(true);
  });


  it('builds action creators that create the expected actions', () => {
    const actionCreators = buildActionCreators(name, actions);
    expect(actionCreators.testAction(true)).toEqual({
      type: types.testAction,
      payload: true,
    });
    expect(actionCreators.action2(true)).toEqual({
      type: types.action2,
      payload: false,
    });
    expect(actionCreators.nullAction()).toEqual({
      type: types.nullAction,
    });
  });
});

describe('getTypeFromAction', () => {
  it('combines bit name and snake case action name', () => {
    expect(getTypeFromAction('test', 'myTestAction'))
      .toBe(`test/${snakeCase('myTestAction').toUpperCase()}`);
  });
});
