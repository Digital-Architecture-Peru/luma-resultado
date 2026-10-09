-- Esquema de consulta de pagos (PostgreSQL). Migración inmutable: no editar tras aplicarla.
CREATE TABLE pagos (
    id           uuid          PRIMARY KEY,
    cuenta_id    varchar(20)   NOT NULL,
    referencia   varchar(40)   NOT NULL,
    beneficiario varchar(120)  NOT NULL,
    monto        numeric(18,2) NOT NULL CHECK (monto > 0),
    moneda       char(3)       NOT NULL CHECK (moneda ~ '^[A-Z]{3}$'),
    estado       varchar(10)   NOT NULL CHECK (estado IN ('PENDIENTE', 'PROCESADO', 'RECHAZADO', 'ANULADO')),
    fecha_pago   timestamptz   NOT NULL,
    canal        varchar(20)   NOT NULL,
    CONSTRAINT uq_pagos_referencia UNIQUE (referencia)
);

CREATE INDEX ix_pagos_cuenta_fecha ON pagos (cuenta_id, fecha_pago DESC);
CREATE INDEX ix_pagos_estado ON pagos (estado);
