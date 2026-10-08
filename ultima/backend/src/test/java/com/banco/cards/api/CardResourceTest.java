package com.banco.cards.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.banco.cards.application.CardNotFoundException;
import com.banco.cards.application.CardQueryService;
import com.banco.cards.application.CustomerContext;
import com.banco.cards.domain.Card;
import com.banco.cards.domain.CardStatus;
import com.banco.cards.domain.CardType;
import jakarta.ws.rs.core.Response;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class CardResourceTest {

    private static final UUID CUSTOMER = UUID.randomUUID();

    private final CardQueryService service = mock(CardQueryService.class);
    private final CustomerContext context = mock(CustomerContext.class);
    private final CardResource resource = new CardResource(service, context);

    private static Card card() {
        return new Card(UUID.randomUUID(), CUSTOMER, "5678", "MASTERCARD", CardType.DEBIT,
                CardStatus.ACTIVE, "ANA EJEMPLO", null, new BigDecimal("10.50"), "USD");
    }

    @Test
    void givenCards_whenList_thenDtosAreMasked() {
        Card c = card();
        when(context.currentCustomerId()).thenReturn(CUSTOMER);
        when(service.listFor(CUSTOMER)).thenReturn(List.of(c));

        List<CardDto> result = resource.list();

        assertEquals(1, result.size());
        assertEquals("**** **** **** 5678", result.get(0).maskedNumber());
        assertEquals("DEBIT", result.get(0).type());
    }

    @Test
    void givenUnknownCard_whenGet_thenCardNotFound() {
        UUID id = UUID.randomUUID();
        when(context.currentCustomerId()).thenReturn(CUSTOMER);
        when(service.getFor(CUSTOMER, id)).thenThrow(new CardNotFoundException());

        assertThrows(CardNotFoundException.class, () -> resource.get(id.toString()));
    }

    @Test
    void givenMalformedId_whenGet_thenCardNotFound() {
        when(context.currentCustomerId()).thenReturn(CUSTOMER);

        assertThrows(CardNotFoundException.class, () -> resource.get("no-es-uuid"));
    }

    @Test
    void givenNotFound_whenMapped_thenProblemJson404() {
        Response response = new ProblemMapper().toResponse(new CardNotFoundException());

        assertEquals(404, response.getStatus());
        assertEquals(ProblemMapper.PROBLEM_JSON, response.getMediaType().toString());
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getEntity();
        assertEquals(404, body.get("status"));
        assertTrue(body.containsKey("title"));
    }
}
