-- Esquema de notificaciones de cuentas (PostgreSQL).
CREATE TABLE account (
    id            VARCHAR(40) PRIMARY KEY,
    masked_number VARCHAR(12) NOT NULL CHECK (masked_number ~ '^\*{4}[0-9]{4}$')
);

CREATE TABLE notification (
    id         UUID PRIMARY KEY,
    account_id VARCHAR(40)    NOT NULL REFERENCES account (id),
    type       VARCHAR(20)    NOT NULL CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'LOW_BALANCE')),
    title      VARCHAR(120)   NOT NULL,
    body       VARCHAR(500)   NOT NULL,
    amount     NUMERIC(18, 2),
    currency   CHAR(3),
    created_at TIMESTAMPTZ    NOT NULL,
    read_at    TIMESTAMPTZ,
    CHECK ((amount IS NULL) = (currency IS NULL))
);

CREATE INDEX idx_notification_account_created
    ON notification (account_id, created_at DESC);

CREATE INDEX idx_notification_unread
    ON notification (account_id, created_at DESC)
    WHERE read_at IS NULL;

CREATE TABLE notification_preference (
    account_id VARCHAR(40)   NOT NULL REFERENCES account (id),
    type       VARCHAR(20)   NOT NULL CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'LOW_BALANCE')),
    enabled    BOOLEAN       NOT NULL DEFAULT TRUE,
    threshold  NUMERIC(18, 2) CHECK (threshold IS NULL OR threshold >= 0),
    PRIMARY KEY (account_id, type)
);
