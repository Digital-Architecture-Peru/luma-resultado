CREATE TABLE account (
    id           UUID          PRIMARY KEY,
    customer_id  VARCHAR(40)   NOT NULL,
    number       VARCHAR(34)   NOT NULL UNIQUE,
    currency     CHAR(3)       NOT NULL,
    balance      NUMERIC(19,2) NOT NULL CHECK (balance >= 0),
    version      BIGINT        NOT NULL DEFAULT 0
);

CREATE INDEX idx_account_customer ON account (customer_id);

CREATE TABLE payment (
    id                 UUID          PRIMARY KEY,
    idempotency_key    VARCHAR(64)   NOT NULL UNIQUE,
    source_account_id  UUID          NOT NULL REFERENCES account (id),
    target_account     VARCHAR(34)   NOT NULL,
    amount             NUMERIC(19,2) NOT NULL CHECK (amount > 0),
    currency           CHAR(3)       NOT NULL,
    status             VARCHAR(12)   NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'REJECTED')),
    reference          VARCHAR(140),
    created_at         TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_payment_source_created ON payment (source_account_id, created_at DESC);
