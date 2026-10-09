export const config = {
  apiUrl: (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5080",
  // H2: stub de identidad hasta integrar la autenticación de Banca por Internet.
  clienteId:
    (import.meta.env.VITE_CLIENTE_ID as string | undefined) ?? "11111111-1111-1111-1111-111111111111",
  locale: (import.meta.env.VITE_LOCALE as string | undefined) ?? "es",
};
