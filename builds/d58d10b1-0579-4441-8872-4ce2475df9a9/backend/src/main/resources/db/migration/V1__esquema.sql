CREATE TABLE tarjeta (
    id               UUID          PRIMARY KEY,
    cliente_id       UUID          NOT NULL,
    ultimos4         CHAR(4)       NOT NULL CHECK (ultimos4 ~ '^[0-9]{4}$'),
    marca            VARCHAR(30)   NOT NULL,
    tipo             VARCHAR(10)   NOT NULL CHECK (tipo IN ('CREDITO', 'DEBITO')),
    estado           VARCHAR(10)   NOT NULL CHECK (estado IN ('ACTIVA', 'BLOQUEADA', 'VENCIDA')),
    moneda           CHAR(3)       NOT NULL CHECK (moneda ~ '^[A-Z]{3}$'),
    limite_credito   NUMERIC(15,2) CHECK (limite_credito >= 0),
    saldo_disponible NUMERIC(15,2) NOT NULL,
    vencimiento      DATE          NOT NULL,
    creado_en        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_tarjeta_cliente ON tarjeta (cliente_id);
