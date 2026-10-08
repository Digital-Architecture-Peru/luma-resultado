CREATE TABLE card (
    id                UUID PRIMARY KEY,
    customer_id       VARCHAR(40)    NOT NULL,
    pan_last4         CHAR(4)        NOT NULL CHECK (pan_last4 ~ '^[0-9]{4}$'),
    type              VARCHAR(10)    NOT NULL CHECK (type IN ('CREDIT', 'DEBIT')),
    status            VARCHAR(10)    NOT NULL CHECK (status IN ('ACTIVE', 'BLOCKED', 'EXPIRED')),
    credit_limit      NUMERIC(15, 2) NOT NULL CHECK (credit_limit >= 0),
    available_balance NUMERIC(15, 2) NOT NULL,
    currency          CHAR(3)        NOT NULL,
    expiry_month      SMALLINT       NOT NULL CHECK (expiry_month BETWEEN 1 AND 12),
    expiry_year       SMALLINT       NOT NULL,
    created_at        TIMESTAMPTZ    NOT NULL DEFAULT now()
);

CREATE INDEX idx_card_customer_status ON card (customer_id, status);
