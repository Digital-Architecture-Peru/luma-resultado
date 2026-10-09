-- Consulta de Pagos: tabla de lectura (PostgreSQL, SQL estándar).
CREATE TABLE payments (
    id             uuid           PRIMARY KEY,
    customer_id    uuid           NOT NULL,
    beneficiary    varchar(120)   NOT NULL,
    account_masked varchar(20)    NOT NULL,
    amount         numeric(18,2)  NOT NULL CHECK (amount >= 0),
    currency       char(3)        NOT NULL,
    status         varchar(20)    NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'REJECTED')),
    paid_at        timestamptz    NOT NULL,
    reference      varchar(40)    NOT NULL
);

CREATE INDEX ix_payments_customer_paid_at ON payments (customer_id, paid_at DESC);
CREATE INDEX ix_payments_status ON payments (status);
