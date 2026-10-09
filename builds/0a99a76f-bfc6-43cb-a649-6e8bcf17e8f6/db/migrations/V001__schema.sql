-- Esquema PostgreSQL para Cuentas / Transacción (transferencias entre cuentas propias).
CREATE TABLE accounts (
    id          BIGSERIAL PRIMARY KEY,
    number      VARCHAR(20)   NOT NULL UNIQUE,
    holder      VARCHAR(100)  NOT NULL,
    currency    CHAR(3)       NOT NULL,
    balance     NUMERIC(18,2) NOT NULL CHECK (balance >= 0),
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE transfers (
    id               BIGSERIAL PRIMARY KEY,
    idempotency_key  VARCHAR(100)  NOT NULL UNIQUE,
    source_id        BIGINT        NOT NULL REFERENCES accounts (id),
    target_id        BIGINT        NOT NULL REFERENCES accounts (id),
    amount           NUMERIC(18,2) NOT NULL CHECK (amount > 0),
    description      VARCHAR(140),
    status           VARCHAR(20)   NOT NULL DEFAULT 'COMPLETED',
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CHECK (source_id <> target_id)
);

CREATE TABLE transactions (
    id           BIGSERIAL PRIMARY KEY,
    account_id   BIGINT        NOT NULL REFERENCES accounts (id),
    transfer_id  BIGINT        NOT NULL REFERENCES transfers (id),
    type         VARCHAR(6)    NOT NULL CHECK (type IN ('DEBIT', 'CREDIT')),
    amount       NUMERIC(18,2) NOT NULL CHECK (amount > 0),
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX ix_transactions_account_created ON transactions (account_id, created_at DESC);
CREATE INDEX ix_transfers_source ON transfers (source_id);
CREATE INDEX ix_transfers_target ON transfers (target_id);
