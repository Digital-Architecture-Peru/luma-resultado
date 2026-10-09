CREATE TABLE accounts (
    id          BIGSERIAL PRIMARY KEY,
    number      VARCHAR(20)   NOT NULL UNIQUE,
    customer_id BIGINT        NOT NULL,
    currency    CHAR(3)       NOT NULL,
    balance     NUMERIC(19,2) NOT NULL CHECK (balance >= 0),
    version     BIGINT        NOT NULL DEFAULT 0
);

CREATE INDEX idx_accounts_customer ON accounts (customer_id);

CREATE TABLE transfers (
    id              BIGSERIAL PRIMARY KEY,
    idempotency_key VARCHAR(64)   NOT NULL UNIQUE,
    source_id       BIGINT        NOT NULL REFERENCES accounts (id),
    target_id       BIGINT        NOT NULL REFERENCES accounts (id),
    amount          NUMERIC(19,2) NOT NULL CHECK (amount > 0),
    currency        CHAR(3)       NOT NULL,
    description     VARCHAR(140),
    status          VARCHAR(16)   NOT NULL,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CHECK (source_id <> target_id)
);

CREATE INDEX idx_transfers_source ON transfers (source_id);

CREATE TABLE account_movements (
    id          BIGSERIAL PRIMARY KEY,
    account_id  BIGINT        NOT NULL REFERENCES accounts (id),
    transfer_id BIGINT        NOT NULL REFERENCES transfers (id),
    type        VARCHAR(6)    NOT NULL CHECK (type IN ('DEBIT', 'CREDIT')),
    amount      NUMERIC(19,2) NOT NULL CHECK (amount > 0),
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_movements_account_created ON account_movements (account_id, created_at DESC);
