package com.example.cards.api;

import com.example.cards.domain.Account;
import com.example.cards.domain.Card;
import com.example.cards.domain.CardQueryService.TransactionPage;
import com.example.cards.domain.CardTransaction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

/** DTOs de la API v1. Los montos viajan como string para evitar errores de coma flotante. */
public final class Dtos {

    private Dtos() {
    }

    public record PaymentRequest(
            @NotBlank @Size(max = 36) String sourceAccountId,
            @NotNull BigDecimal amount) {
    }

    public record CardResponse(String id, String last4, String brand, String creditLimit, String balance) {
        static CardResponse from(Card c) {
            return new CardResponse(c.id(), c.last4(), c.brand(),
                    c.creditLimit().toPlainString(), c.balance().toPlainString());
        }
    }

    public record AccountResponse(String id, String alias, String balance) {
        static AccountResponse from(Account a) {
            return new AccountResponse(a.id(), a.alias(), a.balance().toPlainString());
        }
    }

    public record TransactionResponse(String id, String type, String amount, String status, String createdAt) {
        static TransactionResponse from(CardTransaction t) {
            return new TransactionResponse(t.id(), t.type(), t.amount().toPlainString(),
                    t.status(), t.createdAt().toString());
        }
    }

    public record PageResponse<T>(List<T> items, int page, int size, long total) {
        static PageResponse<TransactionResponse> from(TransactionPage p) {
            return new PageResponse<>(
                    p.items().stream().map(TransactionResponse::from).toList(),
                    p.page(), p.size(), p.total());
        }
    }

    public record PaymentResponse(String transactionId, String cardId, String amount, String status, String createdAt) {
        static PaymentResponse from(CardTransaction t) {
            return new PaymentResponse(t.id(), t.cardId(), t.amount().toPlainString(),
                    t.status(), t.createdAt().toString());
        }
    }
}
