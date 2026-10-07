CREATE TABLE card (
    id                UUID          PRIMARY KEY,
    customer_id       VARCHAR(36)   NOT NULL,
    alias             VARCHAR(60)   NOT NULL,
    last4             CHAR(4)       NOT NULL,
    type              VARCHAR(10)   NOT NULL,
    status            VARCHAR(10)   NOT NULL,
    credit_limit      NUMERIC(15,2) NOT NULL DEFAULT 0,
    available_balance NUMERIC(15,2) NOT NULL DEFAULT 0,
    currency          CHAR(3)       NOT NULL,
    expiry_date       DATE          NOT NULL,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_card_type   CHECK (type IN ('CREDIT', 'DEBIT')),
    CONSTRAINT ck_card_status CHECK (status IN ('ACTIVE', 'BLOCKED', 'EXPIRED')),
    CONSTRAINT ck_card_last4  CHECK (last4 ~ '^[0-9]{4}$'),
    CONSTRAINT ck_card_amounts CHECK (credit_limit >= 0)
);

CREATE INDEX idx_card_customer_id ON card (customer_id);
