package com.bank.cards.adapters.out.network;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.math.BigDecimal;
import java.util.UUID;

import org.junit.jupiter.api.Test;

class StubCardNetworkAdapterTest {

    private final StubCardNetworkAdapter adapter = new StubCardNetworkAdapter();

    @Test
    void givenAmountWithinLimit_whenAuthorize_thenApproved() {
        assertTrue(adapter.authorize(UUID.randomUUID(), new BigDecimal("100.00"), "USD"));
    }

    @Test
    void givenAmountAboveLimit_whenAuthorize_thenDeclined() {
        assertFalse(adapter.authorize(UUID.randomUUID(), new BigDecimal("100000.01"), "USD"));
    }

    @Test
    void givenZeroAmount_whenAuthorize_thenDeclined() {
        assertFalse(adapter.authorize(UUID.randomUUID(), BigDecimal.ZERO, "USD"));
    }
}
