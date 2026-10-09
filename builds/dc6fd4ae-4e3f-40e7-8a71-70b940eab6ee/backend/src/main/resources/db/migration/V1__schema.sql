CREATE TABLE payment (
    id                         UUID          PRIMARY KEY,
    customer_id                VARCHAR(36)   NOT NULL,
    reference                  VARCHAR(40)   NOT NULL,
    beneficiary_name           VARCHAR(120)  NOT NULL,
    beneficiary_account_masked VARCHAR(20)   NOT NULL,
    amount                     NUMERIC(15,2) NOT NULL CHECK (amount > 0),
    currency                   CHAR(3)       NOT NULL,
    status                     VARCHAR(16)   NOT NULL CHECK (status IN ('PENDING','COMPLETED','REJECTED')),
    executed_at                TIMESTAMPTZ,
    created_at                 TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_customer_executed ON payment (customer_id, executed_at DESC);
CREATE INDEX idx_payment_customer_status ON payment (customer_id, status);
