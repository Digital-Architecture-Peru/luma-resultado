-- PostgreSQL 13+. Esquema inicial de tarjetas y transacciones.
-- Solo se guarda el PAN enmascarado y un token ficticio; nunca el PAN completo ni el CVV.
CREATE TABLE cards (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    masked_pan   VARCHAR(19)  NOT NULL,
    token        VARCHAR(64)  NOT NULL UNIQUE,
    holder_alias VARCHAR(80)  NOT NULL,
    status       VARCHAR(10)  NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT ck_cards_status CHECK (status IN ('ACTIVE', 'BLOCKED', 'CLOSED'))
);

CREATE TABLE card_transactions (
    id               UUID PRIMARY KEY,
    card_id          UUID          NOT NULL REFERENCES cards (id),
    amount           NUMERIC(18,2) NOT NULL,
    currency         CHAR(3)       NOT NULL,
    status           VARCHAR(10)   NOT NULL,
    idempotency_key  VARCHAR(64)   NOT NULL,
    rejection_reason VARCHAR(200),
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT ck_tx_amount_positive CHECK (amount > 0),
    CONSTRAINT ck_tx_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    CONSTRAINT ck_tx_currency CHECK (currency ~ '^[A-Z]{3}$'),
    CONSTRAINT uq_tx_idempotency_key UNIQUE (idempotency_key)
);
