-- V001: esquema de notificaciones de tarjetas (PostgreSQL 14+). Sin extensiones.
-- Nunca se guarda el PAN: solo los últimos 4 dígitos y una referencia opaca de tarjeta.

CREATE TABLE card_notification (
    id          uuid         PRIMARY KEY,
    customer_id varchar(40)  NOT NULL,
    card_ref    varchar(40)  NOT NULL,
    card_last4  char(4)      NOT NULL CHECK (card_last4 ~ '^[0-9]{4}$'),
    type        varchar(30)  NOT NULL CHECK (type IN
                    ('PurchaseApproved', 'PurchaseDeclined', 'CardBlocked',
                     'CardUnblocked', 'LimitChanged', 'ExpiryUpcoming')),
    title       varchar(120) NOT NULL,
    body        varchar(500) NOT NULL,
    severity    varchar(10)  NOT NULL CHECK (severity IN ('Info', 'Warning', 'Critical')),
    created_at  timestamptz  NOT NULL DEFAULT now(),
    read_at     timestamptz  NULL
);

CREATE INDEX ix_card_notification_customer_created
    ON card_notification (customer_id, created_at DESC);

CREATE INDEX ix_card_notification_unread
    ON card_notification (customer_id, created_at DESC)
    WHERE read_at IS NULL;

CREATE TABLE notification_preference (
    customer_id varchar(40) NOT NULL,
    event_type  varchar(30) NOT NULL CHECK (event_type IN
                    ('PurchaseApproved', 'PurchaseDeclined', 'CardBlocked',
                     'CardUnblocked', 'LimitChanged', 'ExpiryUpcoming')),
    channel     varchar(10) NOT NULL CHECK (channel IN ('InApp', 'Email', 'Sms', 'Push')),
    enabled     boolean     NOT NULL,
    PRIMARY KEY (customer_id, event_type, channel)
);
