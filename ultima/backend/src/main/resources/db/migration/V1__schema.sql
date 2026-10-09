CREATE TABLE account (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    number      VARCHAR(34)   NOT NULL UNIQUE,
    holder      VARCHAR(120)  NOT NULL,
    customer_id VARCHAR(40)   NOT NULL,
    currency    VARCHAR(3)    NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
    balance     NUMERIC(19,2) NOT NULL CHECK (balance >= 0)
);

CREATE INDEX idx_account_customer ON account (customer_id);

CREATE TABLE transfer (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idempotency_key VARCHAR(64)   NOT NULL UNIQUE,
    source_id       BIGINT        NOT NULL REFERENCES account (id),
    target_id       BIGINT        NOT NULL REFERENCES account (id),
    amount          NUMERIC(19,2) NOT NULL CHECK (amount > 0),
    currency        VARCHAR(3)    NOT NULL,
    description     VARCHAR(140),
    status          VARCHAR(20)   NOT NULL,
    created_at      TIMESTAMPTZ   NOT NULL,
    CHECK (source_id <> target_id)
);

CREATE TABLE movement (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id  BIGINT        NOT NULL REFERENCES account (id),
    transfer_id BIGINT        NOT NULL REFERENCES transfer (id),
    type        VARCHAR(10)   NOT NULL CHECK (type IN ('DEBIT', 'CREDIT')),
    amount      NUMERIC(19,2) NOT NULL CHECK (amount > 0),
    created_at  TIMESTAMPTZ   NOT NULL
);

CREATE INDEX idx_movement_account_created ON movement (account_id, created_at DESC);
