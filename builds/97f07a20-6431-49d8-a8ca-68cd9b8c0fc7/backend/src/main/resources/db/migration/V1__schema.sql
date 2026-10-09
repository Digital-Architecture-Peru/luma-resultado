-- Esquema inicial (PostgreSQL). Migración inmutable: los cambios van en V3, V4...
CREATE TABLE account (
    id           BIGINT        PRIMARY KEY,
    number       VARCHAR(20)   NOT NULL UNIQUE,
    holder_alias VARCHAR(60)   NOT NULL,
    currency     VARCHAR(3)    NOT NULL,
    balance      NUMERIC(19,2) NOT NULL CHECK (balance >= 0),
    version      BIGINT        NOT NULL DEFAULT 0
);

CREATE TABLE transfer (
    id              UUID          PRIMARY KEY,
    idempotency_key VARCHAR(64)   NOT NULL UNIQUE,
    source_id       BIGINT        NOT NULL REFERENCES account (id),
    target_id       BIGINT        NOT NULL REFERENCES account (id),
    amount          NUMERIC(19,2) NOT NULL CHECK (amount > 0),
    currency        VARCHAR(3)    NOT NULL,
    description     VARCHAR(140)  NOT NULL DEFAULT '',
    created_at      TIMESTAMPTZ   NOT NULL,
    CHECK (source_id <> target_id)
);

CREATE TABLE movement (
    id          BIGSERIAL     PRIMARY KEY,
    account_id  BIGINT        NOT NULL REFERENCES account (id),
    transfer_id UUID          NOT NULL REFERENCES transfer (id),
    type        VARCHAR(6)    NOT NULL CHECK (type IN ('DEBIT', 'CREDIT')),
    amount      NUMERIC(19,2) NOT NULL CHECK (amount > 0),
    created_at  TIMESTAMPTZ   NOT NULL
);

CREATE INDEX idx_movement_account_created ON movement (account_id, created_at DESC);
CREATE INDEX idx_transfer_source ON transfer (source_id);
