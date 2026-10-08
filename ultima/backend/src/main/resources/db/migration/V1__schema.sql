CREATE TABLE card (
    id                UUID          NOT NULL PRIMARY KEY,
    customer_id       VARCHAR(30)   NOT NULL,
    pan_last4         CHAR(4)       NOT NULL,
    masked_pan        VARCHAR(25)   NOT NULL,
    brand             VARCHAR(20)   NOT NULL,
    card_type         VARCHAR(10)   NOT NULL CHECK (card_type IN ('CREDIT', 'DEBIT')),
    status            VARCHAR(10)   NOT NULL CHECK (status IN ('ACTIVE', 'BLOCKED', 'CANCELLED')),
    credit_limit      NUMERIC(15,2) CHECK (credit_limit >= 0),
    available_balance NUMERIC(15,2) NOT NULL,
    currency          CHAR(3)       NOT NULL,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_card_customer ON card (customer_id);
