CREATE TABLE cards (
    id                uuid PRIMARY KEY,
    customer_id       uuid          NOT NULL,
    pan_last4         char(4)       NOT NULL,
    brand             varchar(20)   NOT NULL,
    card_type         varchar(10)   NOT NULL,
    status            varchar(10)   NOT NULL,
    credit_limit      numeric(14,2) NOT NULL DEFAULT 0,
    available_balance numeric(14,2) NOT NULL DEFAULT 0,
    currency          char(3)       NOT NULL,
    expiry_month      integer       NOT NULL,
    expiry_year       integer       NOT NULL,
    created_at        timestamptz   NOT NULL DEFAULT now(),
    CONSTRAINT ck_cards_pan_last4 CHECK (pan_last4 ~ '^[0-9]{4}$'),
    CONSTRAINT ck_cards_type CHECK (card_type IN ('CREDIT', 'DEBIT')),
    CONSTRAINT ck_cards_status CHECK (status IN ('ACTIVE', 'BLOCKED', 'EXPIRED')),
    CONSTRAINT ck_cards_expiry_month CHECK (expiry_month BETWEEN 1 AND 12),
    CONSTRAINT ck_cards_amounts CHECK (credit_limit >= 0 AND available_balance >= 0)
);

CREATE INDEX ix_cards_customer_id ON cards (customer_id);
