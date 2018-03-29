module.exports = {
  setupFiles: [
    '<rootDir>/test/setup.js',
  ],
  snapshotSerializers: [
    '<rootDir>/node_modules/enzyme-to-json/serializer',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  transform: {
    '\\.jsx?$': '<rootDir>/node_modules/babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/',
  ],
  rootDir: '../',
  roots: [
    '<rootDir>/test',
  ],
  unmockedModulePathPatterns: [
    '<rootDir>/node_modules/react',
  ],
};
