-- Notificaciones de pagos (PostgreSQL). Migración inmutable: no editar tras aplicarla.
CREATE TABLE notification (
    id            UUID PRIMARY KEY,
    customer_id   VARCHAR(36)   NOT NULL,
    payment_id    VARCHAR(64)   NOT NULL,
    type          VARCHAR(32)   NOT NULL
                  CHECK (type IN ('PAYMENT_SUCCEEDED', 'PAYMENT_FAILED', 'PAYMENT_SCHEDULED')),
    title         VARCHAR(120)  NOT NULL,
    message       VARCHAR(500)  NOT NULL,
    amount        NUMERIC(15,2) NOT NULL CHECK (amount > 0),
    currency      CHAR(3)       NOT NULL,
    account_last4 CHAR(4)       NOT NULL,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    read_at       TIMESTAMPTZ   NULL,
    CONSTRAINT uq_notification_payment_type UNIQUE (payment_id, type)
);

CREATE INDEX idx_notification_customer_created
    ON notification (customer_id, created_at DESC);

CREATE INDEX idx_notification_unread
    ON notification (customer_id, created_at DESC)
    WHERE read_at IS NULL;
