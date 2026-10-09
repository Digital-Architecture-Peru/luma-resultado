CREATE TABLE payment (
    id              UUID           PRIMARY KEY,
    idempotency_key VARCHAR(64)    NOT NULL UNIQUE,
    source_account  VARCHAR(34)    NOT NULL,
    beneficiary     VARCHAR(34)    NOT NULL,
    amount          NUMERIC(19, 2) NOT NULL CHECK (amount > 0),
    currency        CHAR(3)        NOT NULL,
    status          VARCHAR(12)    NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'REJECTED')),
    reference       VARCHAR(140),
    created_at      TIMESTAMPTZ    NOT NULL
);

CREATE INDEX idx_payment_source_created ON payment (source_account, created_at DESC);
