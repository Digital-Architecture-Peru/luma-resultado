package com.example.cards.api;

import com.example.cards.api.Dtos.AccountResponse;
import com.example.cards.api.Dtos.CardResponse;
import com.example.cards.api.Dtos.PageResponse;
import com.example.cards.api.Dtos.PaymentRequest;
import com.example.cards.api.Dtos.PaymentResponse;
import com.example.cards.api.Dtos.TransactionResponse;
import com.example.cards.domain.CardQueryService;
import com.example.cards.domain.PaymentCommand;
import com.example.cards.domain.PaymentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * API v1. H2: la autenticación la resuelve Banca por Internet; aquí el cliente llega en el
 * header ficticio X-Customer-Id.
 */
@RestController
@RequestMapping("/api/v1")
public class CardController {

    private final PaymentService paymentService;
    private final CardQueryService queryService;

    public CardController(PaymentService paymentService, CardQueryService queryService) {
        this.paymentService = paymentService;
        this.queryService = queryService;
    }

    @GetMapping("/cards")
    public List<CardResponse> cards(@RequestHeader("X-Customer-Id") String customerId) {
        return queryService.listCards(customerId).stream().map(CardResponse::from).toList();
    }

    @GetMapping("/accounts")
    public List<AccountResponse> accounts(@RequestHeader("X-Customer-Id") String customerId) {
        return queryService.listAccounts(customerId).stream().map(AccountResponse::from).toList();
    }

    @GetMapping("/cards/{cardId}/transactions")
    public PageResponse<TransactionResponse> transactions(
            @RequestHeader("X-Customer-Id") String customerId,
            @PathVariable String cardId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return Dtos.PageResponse.from(queryService.listTransactions(customerId, cardId, page, size));
    }

    @PostMapping("/cards/{cardId}/payments")
    public ResponseEntity<PaymentResponse> pay(
            @RequestHeader("X-Customer-Id") String customerId,
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @PathVariable String cardId,
            @Valid @RequestBody PaymentRequest request) {
        if (idempotencyKey.isBlank() || idempotencyKey.length() > 64) {
            throw new IllegalArgumentException("Idempotency-Key debe tener entre 1 y 64 caracteres");
        }
        var tx = paymentService.pay(customerId, cardId,
                new PaymentCommand(request.sourceAccountId(), request.amount(), idempotencyKey));
        return ResponseEntity.status(HttpStatus.CREATED).body(PaymentResponse.from(tx));
    }
}
