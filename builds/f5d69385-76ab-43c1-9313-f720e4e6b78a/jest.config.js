/**
 * testMatch usa un glob RELATIVO a propósito: Jest antepone rootDir a los globs
 * absolutos y, en Windows, un rootDir con "\" mezclado con "/" rompe micromatch
 * (0 coincidencias → "No tests found").
 * @type {import('jest').Config}
 */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['**/src/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
