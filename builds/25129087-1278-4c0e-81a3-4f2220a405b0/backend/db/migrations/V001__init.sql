-- Esquema inicial de notificaciones de tarjeta (PostgreSQL).
CREATE TABLE notificacion (
    id          uuid          PRIMARY KEY,
    cliente_id  varchar(40)   NOT NULL,
    tarjeta_ref varchar(60)   NOT NULL,
    ultimos4    char(4)       NOT NULL CHECK (ultimos4 ~ '^[0-9]{4}$'),
    tipo        varchar(20)   NOT NULL CHECK (tipo IN ('COMPRA', 'LIMITE', 'VENCIMIENTO', 'PAGO')),
    titulo      varchar(120)  NOT NULL,
    mensaje     varchar(500)  NOT NULL,
    monto       numeric(18,2) CHECK (monto IS NULL OR monto >= 0),
    moneda      char(3),
    leida       boolean       NOT NULL DEFAULT false,
    creada_en   timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX ix_notificacion_bandeja
    ON notificacion (cliente_id, tarjeta_ref, leida, creada_en DESC);

CREATE TABLE preferencia_notificacion (
    cliente_id   varchar(40)   NOT NULL,
    tarjeta_ref  varchar(60)   NOT NULL,
    tipo         varchar(20)   NOT NULL CHECK (tipo IN ('COMPRA', 'LIMITE', 'VENCIMIENTO', 'PAGO')),
    canal        varchar(10)   NOT NULL CHECK (canal IN ('WEB', 'EMAIL', 'SMS', 'PUSH')),
    habilitada   boolean       NOT NULL DEFAULT true,
    umbral_monto numeric(18,2) CHECK (umbral_monto IS NULL OR umbral_monto >= 0),
    PRIMARY KEY (cliente_id, tarjeta_ref, tipo, canal)
);
