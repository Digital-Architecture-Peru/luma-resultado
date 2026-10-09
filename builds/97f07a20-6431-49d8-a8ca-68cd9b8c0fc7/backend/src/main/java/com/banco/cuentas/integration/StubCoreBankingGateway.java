package com.banco.cuentas.integration;

import com.banco.cuentas.domain.TransferReceipt;
import jakarta.enterprise.context.ApplicationScoped;
import org.jboss.logging.Logger;

/** Adaptador ficticio: no llama a ningún sistema real y no registra datos sensibles. */
@ApplicationScoped
public class StubCoreBankingGateway implements CoreBankingGateway {

    private static final Logger LOG = Logger.getLogger(StubCoreBankingGateway.class);

    @Override
    public void notifyTransferCompleted(TransferReceipt receipt) {
        LOG.infof("Transferencia %s registrada (stub, sin integración real)", receipt.id());
    }
}
