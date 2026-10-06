// Todo lo que va aquí termina en el bundle del navegador: NO colocar secretos.
export const environment = {
  production: false,
  /** URL ficticia; solo la usa HttpCustomersRepository (no conectado por defecto). */
  apiBaseUrl: 'https://api.example.invalid/v1',
  /** 'memory' (por defecto) o 'http'. */
  repository: 'memory' as 'memory' | 'http',
};
