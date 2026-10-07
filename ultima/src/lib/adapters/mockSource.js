const now = Date.now();
const minutes = (m) => new Date(now - m * 60000).toISOString();

/** Datos ficticios. */
const DATA = [
  { id: 'n1', type: 'compra', cardLast4: '1234', title: 'Compra aprobada', body: 'Compra en Tienda Demo.', amount: 45.9, createdAt: minutes(5), read: false },
  { id: 'n2', type: 'pago_proximo', cardLast4: '1234', title: 'Pago próximo', body: 'Tu pago vence en 3 días.', amount: 120, createdAt: minutes(180), read: false },
  { id: 'n3', type: 'limite', cardLast4: '9876', title: 'Límite al 90%', body: 'Has usado el 90% de tu cupo.', createdAt: minutes(1500), read: true },
  { id: 'n4', type: 'bloqueo', cardLast4: '9876', title: 'Tarjeta bloqueada', body: 'Bloqueo temporal solicitado desde la app.', createdAt: minutes(4000), read: true }
];

/** @returns {import('../ports/notificationSource.js').NotificationSource} */
export function createMockSource(data = DATA) {
  return {
    list: async () => data.map((n) => ({ ...n }))
  };
}

export const mockSource = createMockSource();
