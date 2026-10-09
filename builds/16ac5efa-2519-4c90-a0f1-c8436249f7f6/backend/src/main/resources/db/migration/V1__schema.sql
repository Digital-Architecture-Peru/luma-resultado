CREATE TABLE account (
    id            BIGSERIAL PRIMARY KEY,
    number_masked VARCHAR(32)   NOT NULL,
    owner_id      VARCHAR(64)   NOT NULL,
    currency      CHAR(3)       NOT NULL,
    balance       NUMERIC(19,2) NOT NULL,
    version       BIGINT        NOT NULL DEFAULT 0,
    CONSTRAINT ck_account_balance CHECK (balance >= 0)
);

CREATE INDEX ix_account_owner ON account (owner_id);

CREATE TABLE transfer (
    id              UUID PRIMARY KEY,
    idempotency_key VARCHAR(80)   NOT NULL,
    source_id       BIGINT        NOT NULL REFERENCES account (id),
    target_id       BIGINT        NOT NULL REFERENCES account (id),
    amount          NUMERIC(19,2) NOT NULL,
    currency        CHAR(3)       NOT NULL,
    description     VARCHAR(140)  NOT NULL DEFAULT '',
    status          VARCHAR(16)   NOT NULL,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT uq_transfer_idempotency UNIQUE (idempotency_key),
    CONSTRAINT ck_transfer_amount CHECK (amount > 0),
    CONSTRAINT ck_transfer_distinct CHECK (source_id <> target_id)
);

CREATE TABLE movement (
    id          BIGSERIAL PRIMARY KEY,
    account_id  BIGINT        NOT NULL REFERENCES account (id),
    transfer_id UUID          NOT NULL REFERENCES transfer (id),
    type        VARCHAR(6)    NOT NULL,
    amount      NUMERIC(19,2) NOT NULL,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT ck_movement_type CHECK (type IN ('DEBIT', 'CREDIT')),
    CONSTRAINT ck_movement_amount CHECK (amount > 0)
);

CREATE INDEX ix_movement_account_created ON movement (account_id, created_at DESC);
