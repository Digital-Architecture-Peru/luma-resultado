CREATE TABLE account (
    id             BIGSERIAL     PRIMARY KEY,
    customer_id    VARCHAR(20)   NOT NULL,
    account_number VARCHAR(20)   NOT NULL UNIQUE,
    type           VARCHAR(20)   NOT NULL CHECK (type IN ('SAVINGS', 'CHECKING')),
    currency       CHAR(3)       NOT NULL CHECK (currency IN ('PEN', 'USD')),
    balance        NUMERIC(18,2) NOT NULL,
    status         VARCHAR(10)   NOT NULL CHECK (status IN ('ACTIVE', 'BLOCKED', 'CLOSED')),
    opened_at      DATE          NOT NULL
);

CREATE INDEX idx_account_customer_id ON account (customer_id);
