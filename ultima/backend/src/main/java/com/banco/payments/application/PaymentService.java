package com.banco.payments.application;

import com.banco.payments.application.ports.AccountRepository;
import com.banco.payments.application.ports.PaymentGateway;
import com.banco.payments.application.ports.PaymentRepository;
import com.banco.payments.domain.Account;
import com.banco.payments.domain.Payment;
import com.banco.payments.domain.PaymentStatus;
import java.time.Clock;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    private final PaymentRepository payments;
    private final AccountRepository accounts;
    private final PaymentGateway gateway;
    private final Clock clock;

    public PaymentService(PaymentRepository payments, AccountRepository accounts,
                          PaymentGateway gateway, Clock clock) {
        this.payments = payments;
        this.accounts = accounts;
        this.gateway = gateway;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public List<Account> accountsOf(String customerId) {
        return accounts.findByCustomerId(customerId);
    }

    @Transactional
    public Payment create(PaymentCommand command) {
        var existing = payments.findByIdempotencyKey(command.idempotencyKey());
        if (existing.isPresent()) {
            return replay(existing.get(), command);
        }

        Account source = ownedAccount(command.sourceAccountId(), command.customerId());
        validate(source, command);

        Payment pending = new Payment(UUID.randomUUID(), command.idempotencyKey(), source.id(),
                command.targetAccount(), command.amount(), command.currency(),
                PaymentStatus.PENDING, command.reference(), clock.instant());

        if (!gateway.authorize(pending)) {
            return payments.save(pending.withStatus(PaymentStatus.REJECTED));
        }
        if (!accounts.updateBalance(source.debit(command.amount()), source.version())) {
            throw new PaymentErrors.ConcurrentUpdate("La cuenta cambio durante la operacion; reintente");
        }
        return payments.save(pending.withStatus(PaymentStatus.COMPLETED));
    }

    @Transactional(readOnly = true)
    public Payment get(UUID paymentId, String customerId) {
        Payment payment = payments.findById(paymentId)
                .orElseThrow(() -> new PaymentErrors.NotFound("Pago no encontrado"));
        ownedAccount(payment.sourceAccountId(), customerId);
        return payment;
    }

    private Payment replay(Payment existing, PaymentCommand command) {
        boolean same = existing.isSameRequest(command.sourceAccountId(), command.targetAccount(),
                command.amount(), command.currency());
        if (!same) {
            throw new PaymentErrors.IdempotencyConflict("La clave de idempotencia ya se uso con otro pago");
        }
        return existing;
    }

    private Account ownedAccount(UUID accountId, String customerId) {
        return accounts.findById(accountId)
                .filter(account -> account.customerId().equals(customerId))
                .orElseThrow(() -> new PaymentErrors.NotFound("Cuenta no encontrada"));
    }

    private void validate(Account source, PaymentCommand command) {
        if (!source.currency().equals(command.currency())) {
            throw new PaymentErrors.InvalidPayment("La moneda no coincide con la cuenta origen");
        }
        if (source.number().equals(command.targetAccount())) {
            throw new PaymentErrors.InvalidPayment("La cuenta destino debe ser distinta de la origen");
        }
        if (!source.canCover(command.amount())) {
            throw new PaymentErrors.InsufficientFunds("Saldo insuficiente");
        }
    }
}
