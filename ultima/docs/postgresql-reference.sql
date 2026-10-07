-- ESQUEMA DE REFERENCIA (NO SE EJECUTA DESDE ESTE FRONTEND)
-- El navegador nunca se conecta a PostgreSQL. Este esquema documenta el modelo que
-- un backend/BFF futuro deberia exponer mediante GET /cuentas y GET /cuentas/{id}.
-- Todas las consultas del backend deben ser parametrizadas (nunca concatenar strings).
-- Sin verificar contra una instancia real de PostgreSQL.

CREATE TABLE IF NOT EXISTS account (
    id               TEXT PRIMARY KEY,
    -- Numero completo: almacenar cifrado/tokenizado; la API solo debe devolver el valor
    -- completo si es imprescindible. La UI lo enmascara (ultimos 4 digitos).
    account_number   TEXT        NOT NULL,
    holder_id        TEXT        NOT NULL,
    holder_name      TEXT        NOT NULL,
    alias            TEXT        NOT NULL,
    account_type     TEXT        NOT NULL CHECK (account_type IN ('SAVINGS', 'CHECKING', 'TERM_DEPOSIT')),
    currency         CHAR(3)     NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),      -- ISO 4217
    balance_minor    BIGINT      NOT NULL,                                       -- unidades menores
    available_minor  BIGINT      NOT NULL,
    status           TEXT        NOT NULL CHECK (status IN ('ACTIVE', 'BLOCKED', 'CLOSED')),
    opened_at        DATE        NOT NULL,
    UNIQUE (account_number)
);

CREATE INDEX IF NOT EXISTS idx_account_holder_type ON account (holder_id, account_type);

-- Consulta de lista (el backend filtra SIEMPRE por el titular autenticado):
--   SELECT id, account_number, alias, account_type, currency, balance_minor,
--          available_minor, status, opened_at, holder_name
--     FROM account
--    WHERE holder_id = $1
--      AND ($2::text IS NULL OR account_type = $2)
--    ORDER BY alias;
--
-- Consulta de detalle:
--   SELECT ... FROM account WHERE holder_id = $1 AND id = $2;
