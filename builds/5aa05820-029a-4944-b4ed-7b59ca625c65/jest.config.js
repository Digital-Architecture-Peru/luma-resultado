/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  // testRegex en lugar de testMatch (glob): el glob no casa en rutas de Windows
  // con espacios y separadores mezclados ("No tests found ... 0 matches").
  testRegex: '[\\\\/]src[\\\\/].*\\.spec\\.ts$',
  testPathIgnorePatterns: ['[\\\\/]node_modules[\\\\/]', '[\\\\/]dist[\\\\/]'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      { tsconfig: '<rootDir>/tsconfig.spec.json', stringifyContentPathRegex: '\\.(html|svg)$' },
    ],
  },
};
