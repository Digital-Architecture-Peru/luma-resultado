-- Esquema de Notificaciones de Cuentas (PostgreSQL)
CREATE TABLE account (
    id            VARCHAR(40) PRIMARY KEY,
    customer_id   VARCHAR(40) NOT NULL,
    masked_number VARCHAR(20) NOT NULL
);
CREATE INDEX idx_account_customer ON account (customer_id);

CREATE TABLE notification (
    id         UUID PRIMARY KEY,
    account_id VARCHAR(40)   NOT NULL REFERENCES account (id),
    type       VARCHAR(20)   NOT NULL CHECK (type IN ('CREDIT', 'DEBIT', 'LOW_BALANCE')),
    title      VARCHAR(120)  NOT NULL,
    message    VARCHAR(500)  NOT NULL,
    status     VARCHAR(10)   NOT NULL DEFAULT 'UNREAD' CHECK (status IN ('UNREAD', 'READ')),
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    read_at    TIMESTAMPTZ
);
CREATE INDEX idx_notification_account_status_created
    ON notification (account_id, status, created_at DESC);

CREATE TABLE notification_preference (
    account_id       VARCHAR(40)   NOT NULL REFERENCES account (id),
    type             VARCHAR(20)   NOT NULL CHECK (type IN ('CREDIT', 'DEBIT', 'LOW_BALANCE')),
    channel          VARCHAR(10)   NOT NULL CHECK (channel IN ('IN_APP', 'EMAIL', 'SMS', 'PUSH')),
    enabled          BOOLEAN       NOT NULL DEFAULT TRUE,
    threshold_amount NUMERIC(15,2) CHECK (threshold_amount IS NULL OR threshold_amount >= 0),
    PRIMARY KEY (account_id, type, channel)
);
