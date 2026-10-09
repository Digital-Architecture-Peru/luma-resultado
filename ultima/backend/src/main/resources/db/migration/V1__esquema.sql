CREATE TABLE cuenta (
    id               BIGSERIAL PRIMARY KEY,
    cliente_id       BIGINT         NOT NULL,
    numero           VARCHAR(20)    NOT NULL UNIQUE,
    tipo             VARCHAR(20)    NOT NULL,
    moneda           CHAR(3)        NOT NULL,
    saldo_disponible NUMERIC(18, 2) NOT NULL,
    estado           VARCHAR(20)    NOT NULL,
    fecha_apertura   DATE           NOT NULL,
    CONSTRAINT ck_cuenta_tipo   CHECK (tipo IN ('AHORROS', 'CORRIENTE')),
    CONSTRAINT ck_cuenta_moneda CHECK (moneda IN ('PEN', 'USD')),
    CONSTRAINT ck_cuenta_estado CHECK (estado IN ('ACTIVA', 'BLOQUEADA', 'CERRADA'))
);

CREATE INDEX ix_cuenta_cliente_id ON cuenta (cliente_id);
