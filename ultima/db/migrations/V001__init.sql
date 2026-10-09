-- PostgreSQL. Esquema inicial de Tarjetas (datos ficticios en V002).
CREATE TABLE cards (
    id                uuid PRIMARY KEY,
    masked_pan        varchar(19)   NOT NULL,
    alias             varchar(40)   NOT NULL,
    credit_limit      numeric(18,2) NOT NULL CHECK (credit_limit > 0),
    available_balance numeric(18,2) NOT NULL,
    currency          char(3)       NOT NULL,
    CHECK (available_balance >= 0 AND available_balance <= credit_limit)
);

CREATE TABLE card_transactions (
    id              uuid PRIMARY KEY,
    card_id         uuid          NOT NULL REFERENCES cards (id),
    type            varchar(20)   NOT NULL CHECK (type IN ('PAYMENT')),
    amount          numeric(18,2) NOT NULL CHECK (amount > 0),
    currency        char(3)       NOT NULL,
    status          varchar(20)   NOT NULL CHECK (status IN ('APPROVED', 'DECLINED')),
    idempotency_key varchar(64)   NOT NULL,
    created_at      timestamptz   NOT NULL DEFAULT now(),
    CONSTRAINT uq_card_transactions_idempotency UNIQUE (idempotency_key)
);

CREATE INDEX ix_card_transactions_card_created
    ON card_transactions (card_id, created_at DESC);
