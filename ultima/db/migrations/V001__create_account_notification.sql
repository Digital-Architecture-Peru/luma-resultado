CREATE TABLE account_notification (
    id          uuid         PRIMARY KEY,
    customer_id varchar(64)  NOT NULL,
    account_id  varchar(64)  NOT NULL,
    type        varchar(20)  NOT NULL CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'LOW_BALANCE')),
    title       varchar(120) NOT NULL,
    message     varchar(500) NOT NULL,
    created_at  timestamptz  NOT NULL DEFAULT now(),
    read_at     timestamptz  NULL
);

CREATE INDEX ix_account_notification_owner_created
    ON account_notification (customer_id, account_id, created_at DESC);

CREATE INDEX ix_account_notification_unread
    ON account_notification (customer_id, account_id)
    WHERE read_at IS NULL;
