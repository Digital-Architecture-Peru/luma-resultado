-- Esquema inicial de notificaciones de pagos (PostgreSQL).
CREATE TABLE IF NOT EXISTS notification (
    id               uuid          PRIMARY KEY,
    customer_id      varchar(64)   NOT NULL,
    payment_event_id varchar(64)   NOT NULL,
    type             varchar(32)   NOT NULL,
    status           varchar(16)   NOT NULL DEFAULT 'UNREAD',
    title            varchar(120)  NOT NULL,
    message          varchar(500)  NOT NULL,
    amount           numeric(18,2) NOT NULL,
    currency         char(3)       NOT NULL,
    masked_account   varchar(16)   NOT NULL,
    created_at       timestamptz   NOT NULL DEFAULT now(),
    read_at          timestamptz,
    CONSTRAINT ck_notification_type   CHECK (type IN ('PAYMENT_COMPLETED', 'PAYMENT_REJECTED', 'PAYMENT_SCHEDULED')),
    CONSTRAINT ck_notification_status CHECK (status IN ('UNREAD', 'READ')),
    CONSTRAINT ck_notification_amount CHECK (amount > 0),
    CONSTRAINT ck_notification_read   CHECK ((status = 'READ') = (read_at IS NOT NULL)),
    -- Idempotencia: un evento de pago no genera notificaciones duplicadas.
    CONSTRAINT uq_notification_event  UNIQUE (customer_id, payment_event_id)
);

CREATE INDEX IF NOT EXISTS ix_notification_customer_status_created
    ON notification (customer_id, status, created_at DESC);
