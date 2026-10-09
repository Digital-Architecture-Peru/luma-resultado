/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  // Se usa testRegex (sobre la ruta completa, con separadores / o \) en lugar de
  // testMatch con rutas absolutas: es robusto con rutas de Windows que contienen espacios.
  roots: ['<rootDir>/src'],
  testRegex: '\\.spec\\.ts$',
  // Se sobrescribe el valor por defecto, que en Windows no casaba con la ruta del workspace.
  testPathIgnorePatterns: ['/out-tsc/', '/dist/'],
};
