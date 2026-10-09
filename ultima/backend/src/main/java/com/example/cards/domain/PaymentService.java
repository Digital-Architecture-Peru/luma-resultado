package com.example.cards.domain;

import com.example.cards.domain.DomainErrors.ConcurrentUpdateException;
import com.example.cards.domain.DomainErrors.DuplicatePaymentException;
import com.example.cards.domain.DomainErrors.NotFoundException;
import com.example.cards.domain.DomainErrors.PaymentRejectedException;
import com.example.cards.port.CardRepository;
import com.example.cards.port.CoreBankingPort;
import java.math.BigDecimal;
import java.time.Clock;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Caso de uso: pagar una tarjeta de crédito desde una cuenta propia. */
@Service
public class PaymentService {

    private static final int MONEY_SCALE = 2;
    private static final int MAX_INTEGER_DIGITS = 13;

    private final CardRepository repository;
    private final CoreBankingPort coreBanking;
    private final Clock clock;

    public PaymentService(CardRepository repository, CoreBankingPort coreBanking, Clock clock) {
        this.repository = repository;
        this.coreBanking = coreBanking;
        this.clock = clock;
    }

    @Transactional
    public CardTransaction pay(String customerId, String cardId, PaymentCommand command) {
        BigDecimal amount = command.amount();
        validateAmount(amount);

        if (repository.findByIdempotencyKey(command.idempotencyKey()).isPresent()) {
            throw new DuplicatePaymentException();
        }
        Card card = repository.findCard(customerId, cardId)
                .orElseThrow(() -> new NotFoundException("Tarjeta no encontrada"));
        Account account = repository.findAccount(customerId, command.sourceAccountId())
                .orElseThrow(() -> new NotFoundException("Cuenta de origen no encontrada"));

        if (amount.compareTo(card.balance()) > 0) {
            throw new PaymentRejectedException("El monto excede la deuda de la tarjeta");
        }
        if (amount.compareTo(account.balance()) > 0) {
            throw new PaymentRejectedException("Saldo insuficiente en la cuenta de origen");
        }

        coreBanking.postPayment(card.id(), account.id(), amount);

        if (!repository.debitAccount(account.id(), amount, account.version())
                || !repository.reduceCardBalance(card.id(), amount, card.version())) {
            throw new ConcurrentUpdateException();
        }
        return repository.saveTransaction(new CardTransaction(
                UUID.randomUUID().toString(),
                card.id(),
                CardTransaction.TYPE_PAYMENT,
                amount,
                CardTransaction.STATUS_POSTED,
                command.idempotencyKey(),
                clock.instant()));
    }

    private static void validateAmount(BigDecimal amount) {
        if (amount == null || amount.signum() <= 0) {
            throw new PaymentRejectedException("El monto debe ser mayor a cero");
        }
        if (amount.scale() > MONEY_SCALE) {
            throw new PaymentRejectedException("El monto admite como máximo 2 decimales");
        }
        if (amount.precision() - amount.scale() > MAX_INTEGER_DIGITS) {
            throw new PaymentRejectedException("El monto es demasiado grande");
        }
    }
}
