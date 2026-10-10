-- V001: esquema de notificaciones de cuenta (PostgreSQL 13+; gen_random_uuid() no requiere extensión)
CREATE TABLE IF NOT EXISTS account_notification (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id  varchar(20)  NOT NULL,
    customer_id varchar(20)  NOT NULL,
    type        varchar(30)  NOT NULL CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'LOW_BALANCE', 'STATEMENT')),
    title       varchar(120) NOT NULL,
    message     varchar(500) NOT NULL,
    created_at  timestamptz  NOT NULL DEFAULT now(),
    read_at     timestamptz  NULL
);

CREATE TABLE IF NOT EXISTS notification_preference (
    account_id  varchar(20) NOT NULL,
    type        varchar(30) NOT NULL CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'LOW_BALANCE', 'STATEMENT')),
    customer_id varchar(20) NOT NULL,
    enabled     boolean     NOT NULL DEFAULT TRUE,
    PRIMARY KEY (account_id, type)
);

CREATE INDEX IF NOT EXISTS ix_account_notification_account_created
    ON account_notification (account_id, created_at DESC);

CREATE INDEX IF NOT EXISTS ix_account_notification_unread
    ON account_notification (account_id, created_at DESC)
    WHERE read_at IS NULL;
