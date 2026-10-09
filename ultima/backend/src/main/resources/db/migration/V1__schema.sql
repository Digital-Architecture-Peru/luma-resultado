CREATE TABLE card (
    id                UUID PRIMARY KEY,
    customer_id       VARCHAR(36)   NOT NULL,
    card_token        VARCHAR(64)   NOT NULL,
    pan_last4         CHAR(4)       NOT NULL,
    brand             VARCHAR(20)   NOT NULL,
    type              VARCHAR(10)   NOT NULL,
    status            VARCHAR(10)   NOT NULL,
    alias             VARCHAR(60)   NOT NULL,
    credit_limit      NUMERIC(15,2) NOT NULL,
    available_balance NUMERIC(15,2) NOT NULL,
    currency          CHAR(3)       NOT NULL,
    expiry_month      SMALLINT      NOT NULL,
    expiry_year       SMALLINT      NOT NULL,
    cutoff_day        SMALLINT      NOT NULL,
    created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_card_type CHECK (type IN ('CREDIT', 'DEBIT')),
    CONSTRAINT ck_card_status CHECK (status IN ('ACTIVE', 'BLOCKED', 'EXPIRED')),
    CONSTRAINT ck_card_last4 CHECK (pan_last4 ~ '^[0-9]{4}$'),
    CONSTRAINT ck_card_expiry_month CHECK (expiry_month BETWEEN 1 AND 12),
    CONSTRAINT ck_card_cutoff CHECK (cutoff_day BETWEEN 1 AND 31),
    CONSTRAINT ck_card_amounts CHECK (credit_limit >= 0 AND available_balance >= 0)
);

CREATE UNIQUE INDEX uq_card_token ON card (card_token);
CREATE INDEX idx_card_customer ON card (customer_id);
