import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { afterEach } from 'vitest';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Vitest no expone `afterEach` global, por lo que Angular no registra su
// limpieza automática. Sin ella, el módulo de pruebas queda instanciado entre
// tests y `configureTestingModule` falla en el segundo test de cada archivo.
afterEach(() => {
  getTestBed().resetTestingModule();
});
