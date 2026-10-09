package com.bank.cards.adapters.in.web;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.bank.cards.adapters.in.web.dto.CreateTransactionRequest;
import com.bank.cards.adapters.in.web.dto.ResponseDtos.CardResponse;
import com.bank.cards.adapters.in.web.dto.ResponseDtos.TransactionCreatedResponse;
import com.bank.cards.adapters.in.web.dto.ResponseDtos.TransactionItemResponse;
import com.bank.cards.adapters.in.web.dto.ResponseDtos.TransactionPageResponse;
import com.bank.cards.application.CardQueryService;
import com.bank.cards.application.CreateTransactionCommand;
import com.bank.cards.application.CreateTransactionUseCase;
import com.bank.cards.domain.CardTransaction;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@RestController
@RequestMapping("/api/v1/cards")
public class CardTransactionController {

    private final CreateTransactionUseCase createTransaction;
    private final CardQueryService queries;
    private final String demoCustomerId;

    public CardTransactionController(CreateTransactionUseCase createTransaction,
                                     CardQueryService queries,
                                     @Value("${app.demo-customer-id}") String demoCustomerId) {
        this.createTransaction = createTransaction;
        this.queries = queries;
        this.demoCustomerId = demoCustomerId;
    }

    @GetMapping
    public List<CardResponse> listCards() {
        return queries.listCards(demoCustomerId).stream()
                .map(c -> new CardResponse(c.id(), c.maskedPan(), c.brand(), c.status(),
                        c.creditLimit(), c.availableBalance()))
                .toList();
    }

    @PostMapping("/{cardId}/transactions")
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionCreatedResponse create(
            @PathVariable UUID cardId,
            @RequestHeader("Idempotency-Key") @NotBlank @Size(max = 80) String idempotencyKey,
            @Valid @RequestBody CreateTransactionRequest request) {
        CardTransaction tx = createTransaction.execute(new CreateTransactionCommand(
                cardId, request.amount(), request.currency(), request.sourceAccountId(),
                request.description(), idempotencyKey));
        return new TransactionCreatedResponse(tx.id(), tx.status().name());
    }

    @GetMapping("/{cardId}/transactions")
    public TransactionPageResponse history(
            @PathVariable UUID cardId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var result = queries.history(cardId, page, size);
        List<TransactionItemResponse> items = result.items().stream()
                .map(t -> new TransactionItemResponse(t.id(), t.amount(), t.currency(), t.status().name(),
                        t.description(), t.createdAt()))
                .toList();
        return new TransactionPageResponse(items, result.page(), result.size(), result.total());
    }
}
