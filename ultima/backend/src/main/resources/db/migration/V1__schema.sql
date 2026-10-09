CREATE TABLE payments (
    id               UUID           PRIMARY KEY,
    origin_account   VARCHAR(20)    NOT NULL,
    beneficiary      VARCHAR(100)   NOT NULL,
    amount           NUMERIC(19,2)  NOT NULL,
    currency         CHAR(3)        NOT NULL,
    concept          VARCHAR(140)   NOT NULL,
    status           VARCHAR(12)    NOT NULL,
    idempotency_key  VARCHAR(64),
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT now(),
    CONSTRAINT ck_payments_amount   CHECK (amount > 0),
    CONSTRAINT ck_payments_currency CHECK (currency IN ('PEN', 'USD')),
    CONSTRAINT ck_payments_status   CHECK (status IN ('PENDIENTE', 'CONFIRMADO', 'RECHAZADO')),
    CONSTRAINT uq_payments_idempotency_key UNIQUE (idempotency_key)
);

CREATE INDEX ix_payments_origin_account_created ON payments (origin_account, created_at DESC);
