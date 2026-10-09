CREATE INDEX ix_cuentas_titular ON cuentas (titular_id);
CREATE INDEX ix_movimientos_cuenta_fecha ON movimientos (cuenta_id, creado_en DESC);
CREATE INDEX ix_movimientos_transferencia ON movimientos (transferencia_id);
