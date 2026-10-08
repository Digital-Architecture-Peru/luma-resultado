-- Esquema de consulta de tarjetas (PostgreSQL). Solo se guarda last4, nunca el PAN completo.
CREATE TABLE cards (
    id            uuid          PRIMARY KEY,
    customer_id   uuid          NOT NULL,
    last4         char(4)       NOT NULL CHECK (last4 ~ '^[0-9]{4}$'),
    brand         varchar(20)   NOT NULL,
    product       varchar(60)   NOT NULL,
    status        varchar(10)   NOT NULL CHECK (status IN ('Active', 'Blocked', 'Expired')),
    credit_limit  numeric(18,2) NOT NULL CHECK (credit_limit >= 0),
    available     numeric(18,2) NOT NULL,
    currency      char(3)       NOT NULL,
    expiry_month  integer       NOT NULL CHECK (expiry_month BETWEEN 1 AND 12),
    expiry_year   integer       NOT NULL CHECK (expiry_year BETWEEN 2000 AND 2100)
);

CREATE TABLE card_movements (
    id           uuid          PRIMARY KEY,
    card_id      uuid          NOT NULL REFERENCES cards (id),
    posted_at    timestamptz   NOT NULL,
    description  varchar(120)  NOT NULL,
    amount       numeric(18,2) NOT NULL,
    currency     char(3)       NOT NULL
);
