-- Datos ficticios para desarrollo. No corresponden a personas ni cuentas reales.
INSERT INTO cuenta (id, cliente_id, numero, tipo, moneda, saldo_disponible, estado, fecha_apertura) VALUES
    (1, 1, '19100000000011', 'AHORROS',   'PEN', 2540.75,  'ACTIVA',    DATE '2021-03-15'),
    (2, 1, '19100000000022', 'CORRIENTE', 'USD', 1200.00,  'ACTIVA',    DATE '2022-07-01'),
    (3, 1, '19100000000033', 'AHORROS',   'PEN', 0.00,     'CERRADA',   DATE '2019-11-20'),
    (4, 2, '19100000000044', 'CORRIENTE', 'PEN', 15890.10, 'BLOQUEADA', DATE '2020-01-10');

-- Las filas anteriores usan ids explícitos: se alinea la secuencia para futuras altas.
SELECT setval(pg_get_serial_sequence('cuenta', 'id'), (SELECT MAX(id) FROM cuenta));
