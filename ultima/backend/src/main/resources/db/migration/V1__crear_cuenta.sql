CREATE TABLE cuenta (
    id             UUID           PRIMARY KEY,
    cliente_id     VARCHAR(40)    NOT NULL,
    numero         VARCHAR(30)    NOT NULL UNIQUE,
    tipo           VARCHAR(10)    NOT NULL CHECK (tipo IN ('AHORRO', 'CORRIENTE')),
    moneda         VARCHAR(3)     NOT NULL CHECK (char_length(moneda) = 3),
    saldo          NUMERIC(18, 2) NOT NULL,
    estado         VARCHAR(10)    NOT NULL CHECK (estado IN ('ACTIVA', 'BLOQUEADA', 'CERRADA')),
    fecha_apertura DATE           NOT NULL
);

CREATE INDEX idx_cuenta_cliente_id ON cuenta (cliente_id);
