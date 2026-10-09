package com.bank.cards.adapters.in.web.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class ResponseDtos {

    private ResponseDtos() {
    }

    public record CardResponse(UUID id, String maskedPan, String brand, String status,
                               BigDecimal creditLimit, BigDecimal availableBalance) {
    }

    public record TransactionCreatedResponse(UUID transactionId, String status) {
    }

    public record TransactionItemResponse(UUID id, BigDecimal amount, String currency, String status,
                                          String description, Instant createdAt) {
    }

    public record TransactionPageResponse(List<TransactionItemResponse> items, int page, int size, long total) {
    }
}
