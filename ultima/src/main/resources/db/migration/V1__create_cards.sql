CREATE TABLE cards (
    id                BIGSERIAL PRIMARY KEY,
    customer_id       VARCHAR(36)   NOT NULL,
    pan_last4         CHAR(4)       NOT NULL CHECK (pan_last4 ~ '^[0-9]{4}$'),
    brand             VARCHAR(20)   NOT NULL,
    card_type         VARCHAR(10)   NOT NULL CHECK (card_type IN ('CREDIT', 'DEBIT')),
    status            VARCHAR(10)   NOT NULL CHECK (status IN ('ACTIVE', 'BLOCKED', 'EXPIRED', 'CANCELLED')),
    currency          CHAR(3)       NOT NULL,
    credit_limit      NUMERIC(14,2) NOT NULL CHECK (credit_limit >= 0),
    available_balance NUMERIC(14,2) NOT NULL,
    expiry_date       DATE          NOT NULL
);

CREATE INDEX idx_cards_customer_status ON cards (customer_id, status, id);
