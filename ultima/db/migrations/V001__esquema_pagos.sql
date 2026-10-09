-- V001: esquema de pagos (PostgreSQL, sintaxis estándar, sin extensiones)
CREATE TABLE pagos (
    id                  UUID          PRIMARY KEY,
    cliente_id          UUID          NOT NULL,
    referencia          VARCHAR(30)   NOT NULL,
    beneficiario        VARCHAR(120)  NOT NULL,
    cuenta_destino_mask VARCHAR(20)   NOT NULL,
    monto               NUMERIC(18,2) NOT NULL CHECK (monto > 0),
    moneda              CHAR(3)       NOT NULL,
    estado              VARCHAR(15)   NOT NULL
        CHECK (estado IN ('PENDIENTE', 'PROCESADO', 'RECHAZADO', 'REVERSADO')),
    fecha_pago          TIMESTAMPTZ   NOT NULL
);

CREATE INDEX ix_pagos_cliente_fecha ON pagos (cliente_id, fecha_pago DESC);
