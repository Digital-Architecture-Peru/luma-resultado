CREATE TABLE card_notification (
    id           UUID         PRIMARY KEY,
    customer_ref VARCHAR(40)  NOT NULL,
    card_ref     VARCHAR(40)  NOT NULL,
    last4        CHAR(4)      NOT NULL,
    type         VARCHAR(30)  NOT NULL
        CHECK (type IN ('TRANSACTION', 'PAYMENT_DUE', 'LIMIT_REACHED', 'CARD_BLOCKED')),
    title        VARCHAR(120) NOT NULL,
    message      VARCHAR(500) NOT NULL,
    status       VARCHAR(10)  NOT NULL DEFAULT 'UNREAD'
        CHECK (status IN ('UNREAD', 'READ')),
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    read_at      TIMESTAMPTZ  NULL,
    CHECK (last4 ~ '^[0-9]{4}$')
);

CREATE INDEX idx_card_notification_customer_status
    ON card_notification (customer_ref, status, created_at DESC);

CREATE INDEX idx_card_notification_card
    ON card_notification (card_ref, created_at DESC);
