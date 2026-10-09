CREATE TABLE card (
    id           VARCHAR(36)   PRIMARY KEY,
    customer_id  VARCHAR(36)   NOT NULL,
    last4        CHAR(4)       NOT NULL,
    brand        VARCHAR(20)   NOT NULL,
    credit_limit NUMERIC(15,2) NOT NULL CHECK (credit_limit >= 0),
    balance      NUMERIC(15,2) NOT NULL CHECK (balance >= 0),
    version      BIGINT        NOT NULL DEFAULT 0
);

CREATE TABLE account (
    id          VARCHAR(36)   PRIMARY KEY,
    customer_id VARCHAR(36)   NOT NULL,
    alias       VARCHAR(60)   NOT NULL,
    balance     NUMERIC(15,2) NOT NULL CHECK (balance >= 0),
    version     BIGINT        NOT NULL DEFAULT 0
);

CREATE TABLE card_transaction (
    id              VARCHAR(36)   PRIMARY KEY,
    card_id         VARCHAR(36)   NOT NULL REFERENCES card (id),
    type            VARCHAR(20)   NOT NULL CHECK (type IN ('PURCHASE', 'PAYMENT')),
    amount          NUMERIC(15,2) NOT NULL CHECK (amount > 0),
    status          VARCHAR(20)   NOT NULL CHECK (status IN ('POSTED', 'REJECTED')),
    idempotency_key VARCHAR(64)   UNIQUE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_tx_card_created ON card_transaction (card_id, created_at DESC);
CREATE INDEX idx_card_customer ON card (customer_id);
CREATE INDEX idx_account_customer ON account (customer_id);
