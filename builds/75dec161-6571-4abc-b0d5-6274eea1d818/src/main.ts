import { initFederation } from '@angular-architects/native-federation';

// Modo standalone: sin manifiesto remoto. Cuando el shell consume el remote, este archivo no se ejecuta.
initFederation()
  .catch((err) => console.error('Error inicializando federación', err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
