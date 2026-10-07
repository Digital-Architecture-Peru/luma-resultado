package com.banca.tarjetas.organisms;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.banca.tarjetas.dto.CardDetailDto;
import com.banca.tarjetas.dto.CardSummaryDto;
import com.banca.tarjetas.dto.PageDto;
import com.banca.tarjetas.model.CardNotFoundException;
import com.banca.tarjetas.model.InvalidQueryException;
import com.banca.tarjetas.molecules.CardMapper;
import org.junit.jupiter.api.Test;

class CardQueryServiceTest {

    private final CardQueryService service =
            new CardQueryService(new InMemoryCardCatalog(), new CardMapper());

    @Test
    void givenNoFilter_whenList_thenReturnsAllWithMaskedPan() {
        PageDto<CardSummaryDto> page = service.list(null, 0, 10);
        assertEquals(3, page.total());
        assertTrue(page.items().stream().allMatch(c -> c.maskedPan().startsWith("**** ****")));
    }

    @Test
    void givenStatusFilter_whenList_thenOnlyThatStatus() {
        PageDto<CardSummaryDto> page = service.list("active", 0, 10);
        assertEquals(1, page.items().size());
        assertEquals("ACTIVE", page.items().get(0).status());
    }

    @Test
    void givenSmallPageSize_whenList_thenPaginates() {
        PageDto<CardSummaryDto> second = service.list(null, 1, 2);
        assertEquals(1, second.items().size());
        assertEquals(3, second.total());
    }

    @Test
    void givenInvalidParams_whenList_thenThrowsInvalidQuery() {
        assertThrows(InvalidQueryException.class, () -> service.list("nope", 0, 10));
        assertThrows(InvalidQueryException.class, () -> service.list(null, -1, 10));
        assertThrows(InvalidQueryException.class, () -> service.list(null, 0, 0));
        assertThrows(InvalidQueryException.class, () -> service.list(null, 0, 1000));
    }

    @Test
    void givenExistingId_whenGet_thenDetailWithoutFullPan() {
        CardDetailDto detail = service.get("CARD-001");
        assertEquals("**** **** **** 1111", detail.maskedPan());
        assertFalse(detail.toString().contains("4111111111111111"));
    }

    @Test
    void givenUnknownId_whenGet_thenNotFound() {
        assertThrows(CardNotFoundException.class, () -> service.get("CARD-999"));
    }

    @Test
    void givenMalformedId_whenGet_thenInvalidQuery() {
        assertThrows(InvalidQueryException.class, () -> service.get("../etc"));
    }
}
