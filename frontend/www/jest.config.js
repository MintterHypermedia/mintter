module.exports = {
  collectCoverageFrom: ['+(pages|components|shared)/**/*.+(js|jsx|ts|tsx)'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/out/'],
  moduleNameMapper: {
    '\\.css$': require.resolve('./test/style-mock.js'),
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    'jest-axe/extend-expect',
  ],
  snapshotSerializers: ['jest-emotion'],
  // coverageThreshold: {
  //   statements: 20,
  //   branches: 30,
  //   functions: 20,
  //   lines: 20,
  // },
  // transform: {
  //   '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  //   '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
  // },
}
