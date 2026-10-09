CREATE TABLE tarjeta (
    id              UUID PRIMARY KEY,
    cliente_id      UUID           NOT NULL,
    marca           VARCHAR(20)    NOT NULL,
    tipo            VARCHAR(10)    NOT NULL CHECK (tipo IN ('CREDITO', 'DEBITO')),
    ultimos4        CHAR(4)        NOT NULL CHECK (ultimos4 ~ '^[0-9]{4}$'),
    estado          VARCHAR(12)    NOT NULL CHECK (estado IN ('ACTIVA', 'BLOQUEADA', 'VENCIDA')),
    limite          NUMERIC(14, 2) NOT NULL CHECK (limite >= 0),
    saldo           NUMERIC(14, 2) NOT NULL,
    moneda          CHAR(3)        NOT NULL,
    vence_mes_anio  CHAR(5)        NOT NULL CHECK (vence_mes_anio ~ '^(0[1-9]|1[0-2])/[0-9]{2}$'),
    creado_en       TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_tarjeta_cliente ON tarjeta (cliente_id);
