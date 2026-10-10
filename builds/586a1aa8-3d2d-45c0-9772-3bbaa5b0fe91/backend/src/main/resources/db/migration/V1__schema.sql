CREATE TABLE payment_notification (
    id             UUID           PRIMARY KEY,
    customer_id    VARCHAR(40)    NOT NULL,
    payment_id     VARCHAR(40)    NOT NULL,
    event_type     VARCHAR(40)    NOT NULL
        CONSTRAINT ck_pn_event_type CHECK (event_type IN ('PAGO_EXITOSO', 'PAGO_RECHAZADO', 'PAGO_PROGRAMADO_PROXIMO')),
    amount         NUMERIC(15, 2) NOT NULL CONSTRAINT ck_pn_amount CHECK (amount >= 0),
    currency       CHAR(3)        NOT NULL,
    masked_account VARCHAR(20)    NOT NULL,
    status         VARCHAR(10)    NOT NULL DEFAULT 'UNREAD'
        CONSTRAINT ck_pn_status CHECK (status IN ('UNREAD', 'READ')),
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT now(),
    read_at        TIMESTAMPTZ,
    -- Idempotencia: un mismo evento de un pago se notifica una sola vez
    CONSTRAINT uq_pn_payment_event UNIQUE (payment_id, event_type)
);

CREATE INDEX idx_pn_customer_created ON payment_notification (customer_id, created_at DESC);
CREATE INDEX idx_pn_customer_unread ON payment_notification (customer_id) WHERE status = 'UNREAD';

CREATE TABLE notification_preference (
    customer_id VARCHAR(40) NOT NULL,
    event_type  VARCHAR(40) NOT NULL
        CONSTRAINT ck_np_event_type CHECK (event_type IN ('PAGO_EXITOSO', 'PAGO_RECHAZADO', 'PAGO_PROGRAMADO_PROXIMO')),
    channel     VARCHAR(10) NOT NULL
        CONSTRAINT ck_np_channel CHECK (channel IN ('IN_APP', 'EMAIL', 'SMS')),
    enabled     BOOLEAN     NOT NULL DEFAULT TRUE,
    PRIMARY KEY (customer_id, event_type, channel)
);
