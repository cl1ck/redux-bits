const validateBit = (bit) => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  // required properties
  const properties = [
    'name',
    'state',
    'actions',
    'reducers',
  ];
  properties.forEach((property) => {
    if (!Object.keys(bit).includes(property)) {
      throw new Error(`Bit is missing the ${property} property.`);
    }
  });

  if (typeof bit.name !== 'string') {
    throw new Error('Bit name must be a valid string');
  }
};

export default validateBit;
