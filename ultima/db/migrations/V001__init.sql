-- V001: esquema inicial de pagos (PostgreSQL)
CREATE TABLE payments (
    id                  UUID           PRIMARY KEY,
    customer_id         VARCHAR(32)    NOT NULL,
    source_account_id   VARCHAR(20)    NOT NULL,
    beneficiary_account VARCHAR(20)    NOT NULL,
    amount              NUMERIC(18,2)  NOT NULL CHECK (amount > 0),
    currency            CHAR(3)        NOT NULL,
    concept             VARCHAR(140)   NOT NULL DEFAULT '',
    status              VARCHAR(10)    NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'REJECTED')),
    failure_reason      VARCHAR(200),
    idempotency_key     VARCHAR(64)    NOT NULL,
    created_at          TIMESTAMPTZ    NOT NULL DEFAULT now(),
    processed_at        TIMESTAMPTZ,
    CONSTRAINT chk_accounts_differ CHECK (source_account_id <> beneficiary_account)
);

CREATE UNIQUE INDEX ux_payments_idempotency_key ON payments (idempotency_key);
CREATE INDEX ix_payments_account_created ON payments (source_account_id, created_at);
CREATE INDEX ix_payments_customer ON payments (customer_id);
