-- V001: esquema inicial de notificaciones de tarjetas (PostgreSQL).
-- Nunca se almacena el PAN: solo card_ref (token) y card_last4.

CREATE TABLE notification (
    id          uuid         PRIMARY KEY,
    customer_id varchar(40)  NOT NULL,
    card_ref    varchar(64)  NOT NULL,
    card_last4  char(4)      NOT NULL CHECK (card_last4 ~ '^[0-9]{4}$'),
    type        varchar(20)  NOT NULL CHECK (type IN ('COMPRA', 'BLOQUEO', 'VENCIMIENTO', 'PAGO_MINIMO')),
    title       varchar(120) NOT NULL,
    body        varchar(500) NOT NULL,
    event_id    varchar(64)  NOT NULL,
    created_at  timestamptz  NOT NULL DEFAULT now(),
    read_at     timestamptz  NULL,
    CONSTRAINT uq_notification_event UNIQUE (event_id)
);

CREATE INDEX ix_notification_customer ON notification (customer_id, created_at DESC);
CREATE INDEX ix_notification_unread ON notification (customer_id, created_at DESC) WHERE read_at IS NULL;

CREATE TABLE notification_preference (
    customer_id varchar(40) NOT NULL,
    type        varchar(20) NOT NULL CHECK (type IN ('COMPRA', 'BLOQUEO', 'VENCIMIENTO', 'PAGO_MINIMO')),
    channel     varchar(10) NOT NULL CHECK (channel IN ('IN_APP', 'EMAIL', 'SMS', 'PUSH')),
    enabled     boolean     NOT NULL,
    PRIMARY KEY (customer_id, type, channel)
);
