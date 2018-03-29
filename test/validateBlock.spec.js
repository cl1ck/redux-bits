/* eslint-disable global-require */
import validateBit from '../src/validateBit';
import createTestBit from './createTestBit';

describe('validateBit', () => {
  it('validates valid bits', () => {
    const bit = createTestBit('test');
    expect(() => validateBit(bit)).not.toThrow();
  });

  it('does no validate invalid bits', () => {
    const invalid1 = createTestBit('invalid1');
    delete invalid1.state;
    expect(() => validateBit(invalid1)).toThrow();

    const invalid2 = createTestBit('invalid2');
    invalid2.name = ['test'];
    expect(() => validateBit(invalid2)).toThrow();

    const invalid3 = createTestBit('invalid3');
    invalid3.reducers = {};
    expect(() => validateBit(invalid3)).toThrow();
  });
});
