CREATE TABLE payment_notification (
    id                UUID          PRIMARY KEY,
    customer_id       VARCHAR(36)   NOT NULL,
    payment_reference VARCHAR(40)   NOT NULL,
    type              VARCHAR(30)   NOT NULL,
    status            VARCHAR(10)   NOT NULL DEFAULT 'UNREAD',
    title             VARCHAR(120)  NOT NULL,
    message           VARCHAR(500)  NOT NULL,
    amount            NUMERIC(15,2) NOT NULL,
    currency          CHAR(3)       NOT NULL,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT now(),
    read_at           TIMESTAMPTZ   NULL,
    CONSTRAINT ck_pn_type CHECK (type IN ('PAGO_EXITOSO', 'PAGO_RECHAZADO', 'PAGO_PROGRAMADO_PROXIMO')),
    CONSTRAINT ck_pn_status CHECK (status IN ('UNREAD', 'READ')),
    CONSTRAINT ck_pn_amount CHECK (amount > 0),
    CONSTRAINT uq_pn_ref_type UNIQUE (payment_reference, type)
);

CREATE INDEX idx_pn_customer_status_created
    ON payment_notification (customer_id, status, created_at DESC);
