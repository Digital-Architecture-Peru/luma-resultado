// testRegex (y no testMatch con <rootDir>): en Windows el rootDir puede contener
// barras invertidas o espacios que un glob interpreta como escapes y no encuentra pruebas.
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testRegex: '\\.spec\\.ts$'
};
