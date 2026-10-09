CREATE TABLE cuentas (
    id             uuid           PRIMARY KEY,
    cliente_id     uuid           NOT NULL,
    numero         varchar(20)    NOT NULL UNIQUE,
    tipo           varchar(10)    NOT NULL CHECK (tipo IN ('AHORROS', 'CORRIENTE')),
    moneda         char(3)        NOT NULL CHECK (moneda IN ('USD', 'PEN', 'EUR')),
    saldo          numeric(18,2)  NOT NULL,
    estado         varchar(10)    NOT NULL CHECK (estado IN ('ACTIVA', 'BLOQUEADA')),
    actualizado_en timestamptz    NOT NULL DEFAULT now()
);

CREATE INDEX ix_cuentas_cliente_id ON cuentas (cliente_id);
