package com.example.accounts.domain;

import java.math.BigDecimal;
import java.time.Instant;

public record Movement(long id, long accountId, long transferId, String type, BigDecimal amount, Instant createdAt) {
}
