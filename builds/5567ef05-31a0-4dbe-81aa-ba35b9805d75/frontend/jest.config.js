// testRegex (y no testMatch con <rootDir>): la ruta absoluta del workspace puede contener
// espacios o barras invertidas (Windows) que rompen los globs de micromatch y dejan 0 coincidencias.
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testRegex: '[\\\\/]src[\\\\/].*\\.spec\\.ts$',
  testPathIgnorePatterns: ['[\\\\/]node_modules[\\\\/]', '[\\\\/]dist[\\\\/]'],
};
