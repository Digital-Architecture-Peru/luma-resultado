import './app.css';
import App from './App.svelte';

const target = document.getElementById('app');
if (!target) {
  throw new Error('No se encontró el contenedor #app');
}

const app = new App({ target });

export default app;
