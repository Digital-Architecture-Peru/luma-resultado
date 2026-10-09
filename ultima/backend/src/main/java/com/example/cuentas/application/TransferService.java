package com.example.cuentas.application;

import com.example.cuentas.domain.Account;
import com.example.cuentas.domain.AccountRepository;
import com.example.cuentas.domain.DomainException;
import com.example.cuentas.domain.Movement;
import com.example.cuentas.domain.MovementRepository;
import com.example.cuentas.domain.Transfer;
import com.example.cuentas.domain.TransferRepository;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Caso de uso: transferencia entre cuentas propias, atómica e idempotente. */
@Service
public class TransferService {

    private static final Logger log = LoggerFactory.getLogger(TransferService.class);

    public record Command(String customerId, String idempotencyKey, Long sourceId, Long targetId,
                          BigDecimal amount, String currency, String description) { }

    public record Result(Transfer transfer, boolean replayed) { }

    private final AccountRepository accounts;
    private final TransferRepository transfers;
    private final MovementRepository movements;
    private final Clock clock;

    public TransferService(AccountRepository accounts, TransferRepository transfers,
                           MovementRepository movements, Clock clock) {
        this.accounts = accounts;
        this.transfers = transfers;
        this.movements = movements;
        this.clock = clock;
    }

    @Transactional
    public Result execute(Command cmd) {
        Optional<Transfer> existing = transfers.findByIdempotencyKey(cmd.idempotencyKey());
        if (existing.isPresent()) {
            return replay(existing.get(), cmd);
        }
        if (cmd.sourceId().equals(cmd.targetId())) {
            throw DomainException.businessRule("SAME_ACCOUNT", "La cuenta origen y destino deben ser distintas.");
        }
        BigDecimal amount = cmd.amount().setScale(2, java.math.RoundingMode.UNNECESSARY);

        List<Account> locked = accounts.lockByIds(List.of(cmd.sourceId(), cmd.targetId()));
        Account source = pick(locked, cmd.sourceId());
        Account target = pick(locked, cmd.targetId());
        validateOwnershipAndCurrency(cmd, source, target);

        source.debit(amount);
        target.credit(amount);

        Instant now = clock.instant();
        Transfer transfer = transfers.add(Transfer.completed(cmd.idempotencyKey(), source.getId(),
                target.getId(), amount, cmd.currency(), cmd.description(), now));
        movements.add(Movement.debit(source.getId(), transfer.getId(), amount, now));
        movements.add(Movement.credit(target.getId(), transfer.getId(), amount, now));

        log.info("Transferencia registrada id={} origen={} destino={}", transfer.getId(), source.getId(), target.getId());
        return new Result(transfer, false);
    }

    private Result replay(Transfer existing, Command cmd) {
        boolean sameRequest = existing.getSourceId().equals(cmd.sourceId())
                && existing.getTargetId().equals(cmd.targetId())
                && existing.getAmount().compareTo(cmd.amount()) == 0
                && existing.getCurrency().equals(cmd.currency());
        if (!sameRequest) {
            throw DomainException.idempotencyConflict(
                    "La clave de idempotencia ya fue usada con una solicitud distinta.");
        }
        return new Result(existing, true);
    }

    private static Account pick(List<Account> accounts, Long id) {
        return accounts.stream()
                .filter(a -> id.equals(a.getId()))
                .findFirst()
                .orElseThrow(() -> DomainException.notFound("ACCOUNT_NOT_FOUND", "Cuenta no encontrada: " + id));
    }

    private static void validateOwnershipAndCurrency(Command cmd, Account source, Account target) {
        if (!source.belongsTo(cmd.customerId()) || !target.belongsTo(cmd.customerId())) {
            throw DomainException.businessRule("ACCOUNT_NOT_OWNED", "Ambas cuentas deben pertenecer al cliente.");
        }
        boolean sameCurrency = source.getCurrency().equals(target.getCurrency())
                && source.getCurrency().equals(cmd.currency());
        if (!sameCurrency) {
            throw DomainException.businessRule("CURRENCY_MISMATCH",
                    "Las cuentas y la transferencia deben tener la misma moneda.");
        }
    }
}
