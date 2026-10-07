package com.banca.internet.tarjetas;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.banca.internet.tarjetas.atoms.CardNotFoundException;
import com.banca.internet.tarjetas.atoms.InvalidRequestException;
import com.banca.internet.tarjetas.molecules.CardResponse;
import com.banca.internet.tarjetas.molecules.PageResponse;
import com.banca.internet.tarjetas.organisms.CardQueryService;
import org.junit.jupiter.api.Test;

class CardQueryServiceTest {

    private final CardQueryService service = new CardQueryService(new FakeCardRepository());

    @Test
    void givenCustomer_whenList_thenOnlyTheirCardsMasked() {
        PageResponse<CardResponse> page = service.list("CLI-1", null, 0, 10);
        assertEquals(3, page.totalItems());
        assertEquals("**** **** **** 1111", page.items().get(0).maskedNumber());
    }

    @Test
    void givenStatusFilter_whenList_thenFiltered() {
        PageResponse<CardResponse> page = service.list("CLI-1", "blocked", 0, 10);
        assertEquals(1, page.items().size());
        assertEquals("BLOCKED", page.items().get(0).status());
    }

    @Test
    void givenPageSize_whenSecondPage_thenRemainingItems() {
        PageResponse<CardResponse> page = service.list("CLI-1", null, 1, 2);
        assertEquals(1, page.items().size());
        assertEquals(3, page.totalItems());
    }

    @Test
    void givenInvalidSize_whenList_thenInvalidRequest() {
        assertThrows(InvalidRequestException.class, () -> service.list("CLI-1", null, 0, 0));
        assertThrows(InvalidRequestException.class, () -> service.list("CLI-1", null, 0, 51));
        assertThrows(InvalidRequestException.class, () -> service.list("CLI-1", null, -1, 10));
    }

    @Test
    void givenBadCustomerId_whenList_thenInvalidRequest() {
        assertThrows(InvalidRequestException.class, () -> service.list("x' OR '1'='1", null, 0, 10));
    }

    @Test
    void givenOwnCard_whenGet_thenReturned() {
        assertEquals(1L, service.get("CLI-1", 1).id());
    }

    @Test
    void givenCardOfOtherCustomer_whenGet_thenNotFound() {
        assertThrows(CardNotFoundException.class, () -> service.get("CLI-1", 4));
    }
}
