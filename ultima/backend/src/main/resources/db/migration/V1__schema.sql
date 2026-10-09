-- Esquema de notificaciones de tarjetas. No se almacena el PAN completo.
CREATE TABLE card (
    id          uuid        PRIMARY KEY,
    customer_id varchar(30) NOT NULL,
    brand       varchar(20) NOT NULL,
    alias       varchar(50) NOT NULL,
    pan_last4   char(4)     NOT NULL CHECK (char_length(pan_last4) = 4)
);

CREATE INDEX idx_card_customer ON card (customer_id);

CREATE TABLE notification (
    id         uuid          PRIMARY KEY,
    card_id    uuid          NOT NULL REFERENCES card (id),
    type       varchar(20)   NOT NULL CHECK (type IN ('COMPRA', 'PAGO', 'VENCIMIENTO', 'BLOQUEO')),
    title      varchar(120)  NOT NULL,
    message    varchar(500)  NOT NULL,
    amount     numeric(15,2),
    currency   char(3),
    status     varchar(10)   NOT NULL DEFAULT 'UNREAD' CHECK (status IN ('UNREAD', 'READ')),
    created_at timestamptz   NOT NULL DEFAULT now(),
    read_at    timestamptz
);

CREATE INDEX idx_notification_card_status_created
    ON notification (card_id, status, created_at DESC);

CREATE TABLE notification_preference (
    card_id uuid        NOT NULL REFERENCES card (id),
    type    varchar(20) NOT NULL CHECK (type IN ('COMPRA', 'PAGO', 'VENCIMIENTO', 'BLOQUEO')),
    channel varchar(10) NOT NULL CHECK (channel IN ('PUSH', 'EMAIL', 'SMS')),
    enabled boolean     NOT NULL DEFAULT false,
    PRIMARY KEY (card_id, type, channel)
);
