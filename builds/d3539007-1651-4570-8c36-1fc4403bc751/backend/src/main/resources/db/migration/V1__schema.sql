CREATE TABLE card (
    id                UUID PRIMARY KEY,
    customer_id       VARCHAR(40)    NOT NULL,
    masked_pan        VARCHAR(19)    NOT NULL,
    brand             VARCHAR(20)    NOT NULL,
    status            VARCHAR(12)    NOT NULL CHECK (status IN ('ACTIVE', 'BLOCKED', 'CLOSED')),
    credit_limit      NUMERIC(15, 2) NOT NULL CHECK (credit_limit >= 0),
    available_balance NUMERIC(15, 2) NOT NULL CHECK (available_balance >= 0)
);

CREATE INDEX idx_card_customer ON card (customer_id);

CREATE TABLE card_transaction (
    id                UUID PRIMARY KEY,
    card_id           UUID           NOT NULL REFERENCES card (id),
    amount            NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    currency          CHAR(3)        NOT NULL,
    source_account_id VARCHAR(40)    NOT NULL,
    description       VARCHAR(140),
    status            VARCHAR(12)    NOT NULL CHECK (status IN ('APPROVED', 'DECLINED')),
    idempotency_key   VARCHAR(80)    NOT NULL UNIQUE,
    created_at        TIMESTAMPTZ    NOT NULL
);

CREATE INDEX idx_card_transaction_card_created ON card_transaction (card_id, created_at DESC);
