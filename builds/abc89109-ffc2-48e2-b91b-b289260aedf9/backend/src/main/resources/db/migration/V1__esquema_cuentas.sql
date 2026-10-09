CREATE TABLE cuenta (
    id                UUID PRIMARY KEY,
    cliente_id        VARCHAR(20)    NOT NULL,
    numero            VARCHAR(20)    NOT NULL UNIQUE,
    tipo              VARCHAR(10)    NOT NULL CHECK (tipo IN ('AHORRO', 'CORRIENTE')),
    moneda            CHAR(3)        NOT NULL,
    saldo_disponible  NUMERIC(18, 2) NOT NULL,
    saldo_contable    NUMERIC(18, 2) NOT NULL,
    estado            VARCHAR(10)    NOT NULL CHECK (estado IN ('ACTIVA', 'BLOQUEADA', 'CERRADA')),
    fecha_apertura    DATE           NOT NULL,
    actualizado_en    TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_cuenta_cliente ON cuenta (cliente_id);
