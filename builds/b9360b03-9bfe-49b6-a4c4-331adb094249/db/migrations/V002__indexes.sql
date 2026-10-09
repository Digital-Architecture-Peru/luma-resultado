-- Consulta principal: últimos movimientos de una tarjeta.
-- idempotency_key ya está indexado por la restricción UNIQUE de V001.
CREATE INDEX ix_card_transactions_card_created
    ON card_transactions (card_id, created_at DESC);
