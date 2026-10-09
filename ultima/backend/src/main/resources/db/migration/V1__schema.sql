CREATE TABLE pago (
    id             BIGSERIAL PRIMARY KEY,
    cuenta_id      VARCHAR(20)   NOT NULL,
    numero_cuenta  VARCHAR(20)   NOT NULL,
    beneficiario   VARCHAR(100)  NOT NULL,
    concepto       VARCHAR(200)  NOT NULL,
    monto          NUMERIC(15,2) NOT NULL CHECK (monto > 0),
    moneda         CHAR(3)       NOT NULL,
    estado         VARCHAR(10)   NOT NULL CHECK (estado IN ('PENDIENTE', 'PROCESADO', 'RECHAZADO')),
    fecha_pago     TIMESTAMPTZ   NOT NULL
);

CREATE INDEX idx_pago_cuenta_fecha ON pago (cuenta_id, fecha_pago DESC);
CREATE INDEX idx_pago_estado ON pago (estado);
