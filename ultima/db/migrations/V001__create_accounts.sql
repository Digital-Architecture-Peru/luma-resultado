-- Esquema de consulta de cuentas (PostgreSQL). SQL estándar, sin extensiones.
CREATE TABLE accounts (
    id                uuid          PRIMARY KEY,
    customer_id       uuid          NOT NULL,
    account_number    varchar(20)   NOT NULL UNIQUE,
    product_type      varchar(30)   NOT NULL,
    currency          char(3)       NOT NULL,
    available_balance numeric(18,2) NOT NULL,
    ledger_balance    numeric(18,2) NOT NULL,
    status            varchar(10)   NOT NULL,
    opened_at         timestamptz   NOT NULL,
    updated_at        timestamptz   NOT NULL,
    CONSTRAINT ck_accounts_status CHECK (status IN ('ACTIVA', 'BLOQUEADA', 'CERRADA')),
    CONSTRAINT ck_accounts_currency CHECK (currency ~ '^[A-Z]{3}$')
);

CREATE INDEX idx_accounts_customer ON accounts (customer_id);
CREATE INDEX idx_accounts_customer_status ON accounts (customer_id, status);
