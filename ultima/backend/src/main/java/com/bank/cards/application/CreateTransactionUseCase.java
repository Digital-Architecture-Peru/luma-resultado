package com.bank.cards.application;

import java.time.Clock;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bank.cards.application.port.CardNetworkPort;
import com.bank.cards.application.port.CardTransactionRepository;
import com.bank.cards.domain.Card;
import com.bank.cards.domain.CardTransaction;
import com.bank.cards.domain.TransactionStatus;

@Service
public class CreateTransactionUseCase {

    private final CardTransactionRepository repository;
    private final CardNetworkPort network;
    private final Clock clock;

    public CreateTransactionUseCase(CardTransactionRepository repository, CardNetworkPort network, Clock clock) {
        this.repository = repository;
        this.network = network;
        this.clock = clock;
    }

    @Transactional
    public CardTransaction execute(CreateTransactionCommand command) {
        Card card = repository.findCard(command.cardId())
                .orElseThrow(() -> new CardNotFoundException(command.cardId()));

        var previous = repository.findByIdempotencyKey(command.idempotencyKey());
        if (previous.isPresent()) {
            return replayOrReject(previous.get(), command);
        }
        if (!card.isActive()) {
            throw new BusinessRuleException("La tarjeta no esta activa");
        }
        if (!network.authorize(card.id(), command.amount(), command.currency())) {
            throw new BusinessRuleException("La red de tarjetas rechazo la transaccion");
        }
        if (!repository.reserveFunds(card.id(), command.amount())) {
            throw new BusinessRuleException("Saldo disponible insuficiente");
        }

        CardTransaction transaction = new CardTransaction(
                UUID.randomUUID(),
                card.id(),
                command.amount(),
                command.currency(),
                command.sourceAccountId(),
                command.description(),
                TransactionStatus.APPROVED,
                command.idempotencyKey(),
                clock.instant());
        repository.save(transaction);
        return transaction;
    }

    private CardTransaction replayOrReject(CardTransaction previous, CreateTransactionCommand command) {
        boolean sameRequest = previous.cardId().equals(command.cardId())
                && previous.amount().compareTo(command.amount()) == 0;
        if (!sameRequest) {
            throw new IdempotencyConflictException(command.idempotencyKey());
        }
        return previous;
    }
}
