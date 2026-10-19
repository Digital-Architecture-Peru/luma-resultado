-- Esquema de pagos (PostgreSQL). Solo lectura desde la API.
CREATE TABLE pagos (
    id                  uuid          PRIMARY KEY,
    cliente_id          varchar(20)   NOT NULL,
    referencia          varchar(40)   NOT NULL,
    beneficiario        varchar(120)  NOT NULL,
    cuenta_destino_mask varchar(20)   NOT NULL,
    monto               numeric(18,2) NOT NULL CHECK (monto > 0),
    moneda              char(3)       NOT NULL,
    estado              varchar(10)   NOT NULL CHECK (estado IN ('PENDIENTE', 'APLICADO', 'RECHAZADO')),
    fecha_pago          timestamptz   NOT NULL,
    canal               varchar(20)   NOT NULL,
    CONSTRAINT uq_pagos_referencia UNIQUE (cliente_id, referencia)
);

CREATE INDEX ix_pagos_cliente_fecha  ON pagos (cliente_id, fecha_pago DESC);
CREATE INDEX ix_pagos_cliente_estado ON pagos (cliente_id, estado);
