CREATE TABLE account_notification (
    id          UUID PRIMARY KEY,
    account_id  VARCHAR(20)  NOT NULL,
    type        VARCHAR(30)  NOT NULL
                CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'LOW_BALANCE')),
    message     VARCHAR(255) NOT NULL,
    amount      NUMERIC(15, 2),
    read_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_account_notification_account_created
    ON account_notification (account_id, created_at DESC);

CREATE INDEX idx_account_notification_unread
    ON account_notification (account_id, created_at DESC)
    WHERE read_at IS NULL;

CREATE TABLE notification_preference (
    account_id             VARCHAR(20) PRIMARY KEY,
    low_balance_threshold  NUMERIC(15, 2) NOT NULL DEFAULT 100.00
                           CHECK (low_balance_threshold >= 0),
    deposit_enabled        BOOLEAN     NOT NULL DEFAULT TRUE,
    withdrawal_enabled     BOOLEAN     NOT NULL DEFAULT TRUE,
    updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);
