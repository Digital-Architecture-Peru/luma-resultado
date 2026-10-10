// testRegex (no testMatch con <rootDir>): el rootDir puede contener "\" y espacios
// (p. ej. rutas de Windows) y los globs de micromatch interpretan "\" como escape,
// lo que dejaba 0 coincidencias. La expresión regular no depende de la ruta absoluta.
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testRegex: '[\\\\/]src[\\\\/].*\\.spec\\.ts$',
  testPathIgnorePatterns: ['[\\\\/]node_modules[\\\\/]', '[\\\\/]dist[\\\\/]'],
  moduleFileExtensions: ['ts', 'js', 'mjs', 'json', 'html'],
};
