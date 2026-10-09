-- Notificaciones de tarjetas. Solo se guarda card_id (UUID) y los últimos 4 dígitos; nunca el PAN.
CREATE TABLE card_notification (
    id          UUID          PRIMARY KEY,
    card_id     UUID          NOT NULL,
    card_last4  CHAR(4)       NOT NULL CHECK (card_last4 ~ '^[0-9]{4}$'),
    type        VARCHAR(20)   NOT NULL
                CHECK (type IN ('PURCHASE', 'PAYMENT_DUE', 'CARD_BLOCKED', 'LIMIT_REACHED')),
    title       VARCHAR(120)  NOT NULL,
    message     VARCHAR(500)  NOT NULL,
    amount      NUMERIC(14,2) CHECK (amount IS NULL OR amount >= 0),
    read_at     TIMESTAMPTZ,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Listado paginado por tarjeta, más reciente primero.
CREATE INDEX idx_card_notification_card_created
    ON card_notification (card_id, created_at DESC);

-- Filtro "solo no leídas".
CREATE INDEX idx_card_notification_unread
    ON card_notification (card_id, created_at DESC)
    WHERE read_at IS NULL;

CREATE TABLE notification_preference (
    card_id  UUID        NOT NULL,
    type     VARCHAR(20) NOT NULL
             CHECK (type IN ('PURCHASE', 'PAYMENT_DUE', 'CARD_BLOCKED', 'LIMIT_REACHED')),
    enabled  BOOLEAN     NOT NULL DEFAULT TRUE,
    PRIMARY KEY (card_id, type)
);
