-- Soportan las consultas: tarjetas por cliente y movimientos por tarjeta, más recientes primero.
CREATE INDEX idx_cards_customer ON cards (customer_id);
CREATE INDEX idx_card_movements_card_posted ON card_movements (card_id, posted_at DESC);
