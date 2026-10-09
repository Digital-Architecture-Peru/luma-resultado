package com.example.accounts.domain;

import java.math.BigDecimal;
import java.util.Optional;

public interface TransferRepository {

    Optional<Transfer> findByIdempotencyKey(String key);

    Transfer insert(Transfer transfer);

    void insertMovement(long accountId, long transferId, String type, BigDecimal amount);
}
