package com.banco.accounts;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.banco.accounts.domain.AccountMasker;
import org.junit.jupiter.api.Test;

class AccountMaskerTest {

    @Test
    void givenLongNumber_whenMask_thenShowsLastFourDigits() {
        assertEquals("****0303", AccountMasker.mask("19100000000303"));
    }

    @Test
    void givenShortNumber_whenMask_thenFullyMasked() {
        assertEquals("****", AccountMasker.mask("123"));
    }

    @Test
    void givenNull_whenMask_thenFullyMasked() {
        assertEquals("****", AccountMasker.mask(null));
    }
}
