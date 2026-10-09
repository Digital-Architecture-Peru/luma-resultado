-- Esquema de consulta de pagos (PostgreSQL). Fechas en UTC (timestamptz).
CREATE TABLE pago (
    id           BIGSERIAL PRIMARY KEY,
    cuenta_id    VARCHAR(34)    NOT NULL,
    beneficiario VARCHAR(120)   NOT NULL,
    concepto     VARCHAR(200)   NOT NULL,
    monto        NUMERIC(18, 2) NOT NULL CHECK (monto > 0),
    moneda       CHAR(3)        NOT NULL,
    estado       VARCHAR(20)    NOT NULL
        CHECK (estado IN ('PENDIENTE', 'PROCESADO', 'RECHAZADO', 'ANULADO')),
    fecha_pago   TIMESTAMPTZ    NOT NULL
);

CREATE INDEX idx_pago_cuenta_fecha ON pago (cuenta_id, fecha_pago DESC);
CREATE INDEX idx_pago_estado ON pago (estado);
