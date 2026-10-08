CREATE TABLE card (
    id                uuid PRIMARY KEY,
    customer_id       uuid           NOT NULL,
    last4             char(4)        NOT NULL CHECK (last4 ~ '^[0-9]{4}$'),
    brand             varchar(20)    NOT NULL,
    card_type         varchar(10)    NOT NULL CHECK (card_type IN ('CREDIT', 'DEBIT')),
    status            varchar(10)    NOT NULL CHECK (status IN ('ACTIVE', 'BLOCKED', 'CANCELLED')),
    holder_name       varchar(80)    NOT NULL,
    credit_limit      numeric(15, 2) CHECK (credit_limit IS NULL OR credit_limit >= 0),
    available_balance numeric(15, 2) NOT NULL,
    currency          char(3)        NOT NULL,
    created_at        timestamptz    NOT NULL DEFAULT now()
);

CREATE INDEX idx_card_customer ON card (customer_id);
CREATE INDEX idx_card_customer_status ON card (customer_id, status);
