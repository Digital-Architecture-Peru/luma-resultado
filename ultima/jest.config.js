/**
 * Los globs de testMatch no deben incluir <rootDir>: en Windows la ruta absoluta
 * contiene "\" (que en un glob es carácter de escape), por lo que ningún archivo
 * coincidía. Se acota la búsqueda con `roots` y se usa un glob relativo.
 *
 * @type {import('jest').Config}
 */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
};
