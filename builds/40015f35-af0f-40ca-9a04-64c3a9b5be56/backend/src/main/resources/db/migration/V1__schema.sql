CREATE TABLE account (
    id             UUID PRIMARY KEY,
    customer_id    VARCHAR(36)   NOT NULL,
    account_number VARCHAR(20)   NOT NULL UNIQUE,
    type           VARCHAR(20)   NOT NULL,
    currency       CHAR(3)       NOT NULL,
    balance        NUMERIC(18,2) NOT NULL,
    status         VARCHAR(12)   NOT NULL,
    updated_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT ck_account_currency CHECK (currency IN ('PEN', 'USD')),
    CONSTRAINT ck_account_type CHECK (type IN ('SAVINGS', 'CHECKING', 'TERM_DEPOSIT')),
    CONSTRAINT ck_account_status CHECK (status IN ('ACTIVE', 'BLOCKED', 'CLOSED'))
);

CREATE INDEX idx_account_customer ON account (customer_id);
