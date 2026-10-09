package com.example.accounts.infrastructure.corebanking;

import com.example.accounts.domain.CoreBankingPort;
import com.example.accounts.domain.TransferCommand;
import org.springframework.stereotype.Component;

/** Adaptador ficticio: autoriza todo. Reemplazar cuando se defina la integración real. */
@Component
public class FakeCoreBankingAdapter implements CoreBankingPort {

    @Override
    public boolean authorize(TransferCommand command) {
        return true;
    }
}
