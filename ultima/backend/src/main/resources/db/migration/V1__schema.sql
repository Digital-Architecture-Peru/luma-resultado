CREATE TABLE pago (
    id                 UUID           PRIMARY KEY,
    cliente_id         VARCHAR(40)    NOT NULL,
    cuenta_origen_mask VARCHAR(24)    NOT NULL,
    beneficiario       VARCHAR(120)   NOT NULL,
    monto              NUMERIC(15, 2) NOT NULL CHECK (monto > 0),
    moneda             CHAR(3)        NOT NULL,
    estado             VARCHAR(12)    NOT NULL,
    fecha_pago         TIMESTAMPTZ    NOT NULL,
    CONSTRAINT ck_pago_estado CHECK (estado IN ('PENDIENTE', 'PROCESADO', 'RECHAZADO'))
);

CREATE INDEX ix_pago_cliente_fecha ON pago (cliente_id, fecha_pago DESC);
