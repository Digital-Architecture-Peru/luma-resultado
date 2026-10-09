-- Esquema de transacciones de tarjetas (PostgreSQL). Nunca se guarda el PAN completo.
CREATE TABLE tarjeta (
    id          BIGSERIAL PRIMARY KEY,
    cliente_id  VARCHAR(40) NOT NULL,
    ultimos4    CHAR(4)     NOT NULL,
    tipo        VARCHAR(10) NOT NULL CHECK (tipo IN ('DEBITO', 'CREDITO')),
    estado      VARCHAR(10) NOT NULL CHECK (estado IN ('ACTIVA', 'BLOQUEADA'))
);

CREATE INDEX idx_tarjeta_cliente ON tarjeta (cliente_id);

CREATE TABLE transaccion (
    id               UUID          PRIMARY KEY,
    tarjeta_id       BIGINT        NOT NULL REFERENCES tarjeta (id),
    monto            NUMERIC(15,2) NOT NULL CHECK (monto > 0),
    moneda           CHAR(3)       NOT NULL,
    estado           VARCHAR(10)   NOT NULL CHECK (estado IN ('PENDIENTE', 'APROBADA', 'RECHAZADA')),
    idempotency_key  VARCHAR(64)   NOT NULL UNIQUE,
    creado_en        TIMESTAMPTZ   NOT NULL
);

CREATE INDEX idx_transaccion_tarjeta_fecha ON transaccion (tarjeta_id, creado_en DESC);
