-- PostgreSQL: bandeja de notificaciones de pagos (Banca por Internet)
CREATE TABLE payment_notifications (
    id          uuid          PRIMARY KEY,
    customer_id varchar(64)   NOT NULL,
    payment_ref varchar(8)    NOT NULL,
    type        varchar(20)   NOT NULL,
    title       varchar(120)  NOT NULL,
    body        varchar(500)  NOT NULL DEFAULT '',
    amount      numeric(18,2) NOT NULL,
    currency    char(3)       NOT NULL,
    created_at  timestamptz   NOT NULL DEFAULT now(),
    read_at     timestamptz   NULL,
    CONSTRAINT ck_payment_notifications_type
        CHECK (type IN ('PAYMENT_DONE', 'PAYMENT_REJECTED', 'PAYMENT_DUE')),
    CONSTRAINT ck_payment_notifications_ref CHECK (payment_ref ~ '^\*{4}[0-9]{4}$'),
    CONSTRAINT ck_payment_notifications_amount CHECK (amount >= 0),
    CONSTRAINT ck_payment_notifications_currency CHECK (currency ~ '^[A-Z]{3}$')
);

-- Listado paginado por cliente, más reciente primero
CREATE INDEX ix_payment_notifications_customer_created
    ON payment_notifications (customer_id, created_at DESC);

-- Contador y filtro de no leídas
CREATE INDEX ix_payment_notifications_customer_unread
    ON payment_notifications (customer_id) WHERE read_at IS NULL;
