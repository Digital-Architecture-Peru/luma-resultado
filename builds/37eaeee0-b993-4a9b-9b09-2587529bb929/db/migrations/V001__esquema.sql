-- PostgreSQL >= 13 (gen_random_uuid() sin extensiones). Migración inmutable.
CREATE TABLE cuentas (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    titular_id          uuid          NOT NULL,
    numero_enmascarado  varchar(32)   NOT NULL,
    moneda              char(3)       NOT NULL,
    saldo               numeric(18,2) NOT NULL CHECK (saldo >= 0),
    version             integer       NOT NULL DEFAULT 0
);

CREATE TABLE transferencias (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key  varchar(80)   NOT NULL UNIQUE,
    origen_id        uuid          NOT NULL REFERENCES cuentas (id),
    destino_id       uuid          NOT NULL REFERENCES cuentas (id),
    monto            numeric(18,2) NOT NULL CHECK (monto > 0),
    moneda           char(3)       NOT NULL,
    concepto         varchar(140),
    saldo_origen     numeric(18,2) NOT NULL,
    estado           varchar(16)   NOT NULL,
    creado_en        timestamptz   NOT NULL DEFAULT now(),
    CHECK (origen_id <> destino_id)
);

CREATE TABLE movimientos (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cuenta_id         uuid          NOT NULL REFERENCES cuentas (id),
    transferencia_id  uuid          NOT NULL REFERENCES transferencias (id),
    tipo              char(1)       NOT NULL CHECK (tipo IN ('D', 'C')),
    monto             numeric(18,2) NOT NULL CHECK (monto > 0),
    saldo_resultante  numeric(18,2) NOT NULL CHECK (saldo_resultante >= 0),
    creado_en         timestamptz   NOT NULL DEFAULT now()
);
