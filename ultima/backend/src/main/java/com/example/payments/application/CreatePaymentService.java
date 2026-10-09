package com.example.payments.application;

import com.example.payments.domain.DuplicateIdempotencyKeyException;
import com.example.payments.domain.Money;
import com.example.payments.domain.Payment;
import com.example.payments.domain.PaymentGateway;
import com.example.payments.domain.PaymentGateway.GatewayDecision;
import com.example.payments.domain.PaymentRepository;
import java.time.Clock;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class CreatePaymentService {

    private static final int MAX_KEY_LENGTH = 64;

    private final PaymentRepository repository;
    private final PaymentGateway gateway;
    private final Clock clock;

    public CreatePaymentService(PaymentRepository repository, PaymentGateway gateway, Clock clock) {
        this.repository = repository;
        this.gateway = gateway;
        this.clock = clock;
    }

    public record Command(String idempotencyKey, String sourceAccount, String beneficiary,
                          String amount, String currency, String reference) { }

    public Payment create(Command cmd) {
        validateKey(cmd.idempotencyKey());
        Money amount = Money.of(cmd.amount(), cmd.currency());

        Optional<Payment> existing = repository.findByIdempotencyKey(cmd.idempotencyKey());
        if (existing.isPresent()) {
            return replayOrConflict(existing.get(), cmd, amount);
        }

        Payment payment = Payment.create(cmd.idempotencyKey(), cmd.sourceAccount(), cmd.beneficiary(),
                amount, cmd.reference(), clock.instant());
        GatewayDecision decision = gateway.authorize(payment);
        if (decision.approved()) {
            payment.complete();
        } else {
            payment.reject();
        }
        return persist(payment, cmd, amount);
    }

    private Payment persist(Payment payment, Command cmd, Money amount) {
        try {
            repository.save(payment);
            return payment;
        } catch (DuplicateIdempotencyKeyException race) {
            Payment winner = repository.findByIdempotencyKey(cmd.idempotencyKey()).orElseThrow(() -> race);
            return replayOrConflict(winner, cmd, amount);
        }
    }

    private Payment replayOrConflict(Payment existing, Command cmd, Money amount) {
        if (existing.sameRequestAs(cmd.sourceAccount(), cmd.beneficiary(), amount)) {
            return existing;
        }
        throw new IdempotencyConflictException(cmd.idempotencyKey());
    }

    private static void validateKey(String key) {
        if (key == null || key.isBlank() || key.length() > MAX_KEY_LENGTH) {
            throw new IllegalArgumentException("Idempotency-Key es obligatorio (max. 64 caracteres)");
        }
    }
}
