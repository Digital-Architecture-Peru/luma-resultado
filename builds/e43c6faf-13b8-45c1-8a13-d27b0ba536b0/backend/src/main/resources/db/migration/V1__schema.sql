CREATE TABLE card (
    id                UUID PRIMARY KEY,
    masked_pan        VARCHAR(19)   NOT NULL,
    holder_alias      VARCHAR(60)   NOT NULL,
    status            VARCHAR(10)   NOT NULL CHECK (status IN ('ACTIVE', 'BLOCKED', 'EXPIRED')),
    credit_limit      NUMERIC(15,2) NOT NULL CHECK (credit_limit >= 0),
    available_balance NUMERIC(15,2) NOT NULL CHECK (available_balance >= 0),
    version           BIGINT        NOT NULL DEFAULT 0
);

CREATE TABLE card_transaction (
    id              UUID PRIMARY KEY,
    card_id         UUID          NOT NULL REFERENCES card (id),
    type            VARCHAR(10)   NOT NULL CHECK (type IN ('PURCHASE', 'PAYMENT', 'REFUND')),
    amount          NUMERIC(15,2) NOT NULL CHECK (amount > 0),
    currency        CHAR(3)       NOT NULL,
    description     VARCHAR(120),
    status          VARCHAR(10)   NOT NULL CHECK (status IN ('APPROVED', 'DECLINED')),
    idempotency_key VARCHAR(64)   NOT NULL UNIQUE,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_card_transaction_card_created ON card_transaction (card_id, created_at DESC);
