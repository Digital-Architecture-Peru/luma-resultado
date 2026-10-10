CREATE TABLE payment_notification (
    id                BIGSERIAL PRIMARY KEY,
    customer_id       VARCHAR(40)   NOT NULL,
    payment_reference VARCHAR(60)   NOT NULL,
    type              VARCHAR(30)   NOT NULL,
    amount            NUMERIC(15,2) NOT NULL,
    currency          CHAR(3)       NOT NULL,
    masked_account    VARCHAR(20)   NOT NULL,
    status            VARCHAR(10)   NOT NULL DEFAULT 'UNREAD',
    created_at        TIMESTAMPTZ   NOT NULL,
    read_at           TIMESTAMPTZ,
    CONSTRAINT ck_notification_type CHECK (type IN ('PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'PAYMENT_SCHEDULED')),
    CONSTRAINT ck_notification_status CHECK (status IN ('UNREAD', 'READ')),
    CONSTRAINT ck_notification_amount CHECK (amount > 0),
    CONSTRAINT uq_notification_reference_type UNIQUE (payment_reference, type)
);

CREATE INDEX ix_notification_customer_created
    ON payment_notification (customer_id, created_at DESC);

CREATE INDEX ix_notification_customer_unread
    ON payment_notification (customer_id)
    WHERE status = 'UNREAD';
