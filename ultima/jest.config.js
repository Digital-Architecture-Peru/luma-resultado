/**
 * Configuración de Jest para Angular.
 * Nota: testMatch usa un glob relativo (no `<rootDir>/...`) porque en Windows el
 * rootDir puede contener espacios y barras invertidas, que rompen el glob
 * y dejaban 0 pruebas encontradas. `roots` acota la búsqueda a `src`.
 * @type {import('jest').Config}
 */
module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      { tsconfig: '<rootDir>/tsconfig.spec.json', stringifyContentPathRegex: '\\.(html|svg)$' },
    ],
  },
};
