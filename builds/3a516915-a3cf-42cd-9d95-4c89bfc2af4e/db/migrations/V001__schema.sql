-- PostgreSQL 13+. Esquema inicial de Pagos (datos ficticios en V002).
CREATE TABLE accounts (
    id         uuid          PRIMARY KEY,
    number     varchar(20)   NOT NULL UNIQUE,
    holder     varchar(120)  NOT NULL,
    currency   char(3)       NOT NULL,
    balance    numeric(18,2) NOT NULL CHECK (balance >= 0)
);

CREATE TABLE payments (
    id                  uuid          PRIMARY KEY,
    idempotency_key     varchar(64)   NOT NULL UNIQUE,
    source_account_id   uuid          NOT NULL REFERENCES accounts (id),
    beneficiary_account varchar(20)   NOT NULL,
    amount              numeric(18,2) NOT NULL CHECK (amount > 0),
    currency            char(3)       NOT NULL,
    status              varchar(10)   NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'REJECTED')),
    reference           varchar(140)  NOT NULL DEFAULT '',
    created_at          timestamptz   NOT NULL
);

CREATE INDEX idx_payments_source_created
    ON payments (source_account_id, created_at DESC);
