package com.example.banking.notifications.application;

import com.example.banking.notifications.application.ports.AccountOwnership;
import com.example.banking.notifications.domain.DomainException;

/** Evita IDOR: toda operación valida que la cuenta pertenece al cliente. */
final class OwnershipGuard {

    private final AccountOwnership ownership;

    OwnershipGuard(AccountOwnership ownership) {
        this.ownership = ownership;
    }

    void require(String customerId, String accountId) {
        if (customerId == null || customerId.isBlank()) {
            throw new DomainException.MissingIdentity("Falta la identidad del cliente");
        }
        if (!ownership.isOwner(customerId, accountId)) {
            throw new DomainException.AccessDenied("La cuenta no pertenece al cliente");
        }
    }
}
