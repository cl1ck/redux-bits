'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var validateBit = function validateBit(bit) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  // required properties
  var properties = ['name', 'state', 'actions', 'reducers'];
  properties.forEach(function (property) {
    if (!Object.keys(bit).includes(property)) {
      throw new Error('Bit is missing the ' + property + ' property.');
    }
  });

  if (typeof bit.name !== 'string') {
    throw new Error('Bit name must be a valid string');
  }
};

exports.default = validateBit;