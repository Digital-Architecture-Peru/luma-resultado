package com.banco.cuentas.integration;

import com.banco.cuentas.domain.TransferReceipt;

/** Puerto hacia el core bancario. La integración real no está definida. */
public interface CoreBankingGateway {

    void notifyTransferCompleted(TransferReceipt receipt);
}
