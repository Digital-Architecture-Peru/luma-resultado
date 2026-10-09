package com.banco.cuentas.domain;

import com.banco.cuentas.persistence.AccountRepository;
import com.banco.cuentas.persistence.TransferRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@ApplicationScoped
public class TransferService {

    static final int MAX_KEY_LENGTH = 80;
    static final int MAX_DESCRIPTION_LENGTH = 140;
    static final int MONEY_SCALE = 2;

    private final AccountRepository accounts;
    private final TransferRepository transfers;

    @Inject
    public TransferService(AccountRepository accounts, TransferRepository transfers) {
        this.accounts = accounts;
        this.transfers = transfers;
    }

    /** Debito y credito en una sola transaccion; idempotente por clave. */
    @Transactional
    public Transfer execute(TransferCommand command) {
        validate(command);

        var existing = transfers.findByIdempotencyKey(command.idempotencyKey());
        if (existing.isPresent()) {
            return replay(existing.get(), command);
        }

        // Orden por id al bloquear: evita deadlocks entre transferencias cruzadas.
        long first = Math.min(command.sourceId(), command.targetId());
        long second = Math.max(command.sourceId(), command.targetId());
        Account firstAccount = lockOwned(first, command.ownerId());
        Account secondAccount = lockOwned(second, command.ownerId());
        Account source = firstAccount.id() == command.sourceId() ? firstAccount : secondAccount;
        Account target = source == firstAccount ? secondAccount : firstAccount;

        ensureSameCurrency(source, target, command.currency());
        BigDecimal amount = command.amount().setScale(MONEY_SCALE);
        if (!source.canCover(amount)) {
            throw DomainException.unprocessable("Saldo insuficiente");
        }

        accounts.updateBalance(source.id(), source.balance().subtract(amount));
        accounts.updateBalance(target.id(), target.balance().add(amount));

        Instant now = Instant.now();
        Transfer transfer = new Transfer(UUID.randomUUID(), command.idempotencyKey(), source.id(), target.id(),
                amount, command.currency(), command.description() == null ? "" : command.description(),
                Transfer.COMPLETED, now);
        transfers.insert(transfer);
        transfers.insertMovement(new Movement(null, source.id(), transfer.id(), Movement.Type.DEBIT, amount, now));
        transfers.insertMovement(new Movement(null, target.id(), transfer.id(), Movement.Type.CREDIT, amount, now));
        return transfer;
    }

    private Transfer replay(Transfer existing, TransferCommand command) {
        if (!existing.samePayload(command)) {
            throw DomainException.conflict("La clave de idempotencia ya se uso con otra solicitud");
        }
        return existing;
    }

    private Account lockOwned(long id, String ownerId) {
        return accounts.findByIdForUpdate(id)
                .filter(account -> account.ownerId().equals(ownerId))
                .orElseThrow(() -> DomainException.notFound("Cuenta " + id + " no encontrada"));
    }

    private void ensureSameCurrency(Account source, Account target, String currency) {
        if (!source.currency().equals(currency) || !target.currency().equals(currency)) {
            throw DomainException.unprocessable("Las cuentas y la transferencia deben usar la misma moneda");
        }
    }

    private void validate(TransferCommand command) {
        String key = command.idempotencyKey();
        if (key == null || key.isBlank() || key.length() > MAX_KEY_LENGTH) {
            throw DomainException.validation("Idempotency-Key es obligatoria (maximo " + MAX_KEY_LENGTH + " caracteres)");
        }
        BigDecimal amount = command.amount();
        if (amount == null || amount.signum() <= 0) {
            throw DomainException.validation("El monto debe ser mayor a cero");
        }
        if (amount.stripTrailingZeros().scale() > MONEY_SCALE) {
            throw DomainException.validation("El monto admite como maximo 2 decimales");
        }
        String currency = command.currency();
        if (currency == null || !currency.matches("[A-Z]{3}")) {
            throw DomainException.validation("La moneda debe ser un codigo ISO de 3 letras");
        }
        if (command.description() != null && command.description().length() > MAX_DESCRIPTION_LENGTH) {
            throw DomainException.validation("La descripcion excede " + MAX_DESCRIPTION_LENGTH + " caracteres");
        }
        if (command.sourceId() == command.targetId()) {
            throw DomainException.unprocessable("La cuenta origen y destino deben ser distintas");
        }
    }
}
