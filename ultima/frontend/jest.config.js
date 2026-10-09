/** Runner no interactivo (una sola pasada); Angular se prueba con jest-preset-angular y jsdom. */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};
