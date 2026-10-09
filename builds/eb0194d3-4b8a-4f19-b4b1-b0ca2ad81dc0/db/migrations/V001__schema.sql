-- Esquema de consulta de tarjetas (PostgreSQL 13+). No almacena PAN completo ni CVV.
CREATE TABLE IF NOT EXISTS cards (
    id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id       varchar(36)   NOT NULL,
    product_name      varchar(60)   NOT NULL,
    brand             varchar(20)   NOT NULL,
    masked_pan        varchar(19)   NOT NULL,
    last4             char(4)       NOT NULL CHECK (last4 ~ '^[0-9]{4}$'),
    status            varchar(10)   NOT NULL CHECK (status IN ('ACTIVE', 'BLOCKED', 'CANCELLED')),
    credit_limit      numeric(14,2) NOT NULL CHECK (credit_limit >= 0),
    available_balance numeric(14,2) NOT NULL,
    currency          char(3)       NOT NULL,
    expiry            char(5)       NOT NULL CHECK (expiry ~ '^[0-9]{2}/[0-9]{2}$'),
    created_at        timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ix_cards_customer_id ON cards (customer_id);
CREATE INDEX IF NOT EXISTS ix_cards_customer_status ON cards (customer_id, status);
