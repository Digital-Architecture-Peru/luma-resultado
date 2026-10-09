package com.banco.ib.payments.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.banco.ib.payments.domain.PageResult;
import com.banco.ib.payments.domain.Payment;
import com.banco.ib.payments.domain.PaymentQuery;
import com.banco.ib.payments.domain.PaymentStatus;
import com.banco.ib.payments.persistence.PaymentRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PaymentQueryServiceTest {

    private static final UUID KNOWN_ID = UUID.fromString("11111111-1111-4111-8111-111111111101");
    private static final Payment SAMPLE = new Payment(KNOWN_ID, "CUST-0001", "PAGO-0001",
            "Empresa Demo", "****1234", new BigDecimal("120.50"), "USD",
            PaymentStatus.COMPLETED, Instant.parse("2026-09-01T10:15:00Z"));

    private FakeRepository repository;
    private PaymentQueryService service;

    @BeforeEach
    void setUp() {
        repository = new FakeRepository();
        service = new PaymentQueryService(repository);
    }

    @Test
    void givenNoFilters_whenSearch_thenUsesDefaultPagingAndReturnsItems() {
        PageResult<Payment> result = service.search("CUST-0001", null, null, null, null, null);

        assertEquals(1, result.items().size());
        assertEquals(0, result.page());
        assertEquals(PaymentQueryService.DEFAULT_SIZE, result.size());
        assertEquals(1L, result.total());
        assertNull(repository.lastQuery.status());
    }

    @Test
    void givenDatesAndStatus_whenSearch_thenBuildsInclusiveUtcRange() {
        service.search("CUST-0001", "2026-09-01", "2026-09-30", "completed", 1, 10);

        PaymentQuery q = repository.lastQuery;
        assertEquals(Instant.parse("2026-09-01T00:00:00Z"), q.from());
        assertEquals(Instant.parse("2026-10-01T00:00:00Z"), q.toExclusive());
        assertEquals(PaymentStatus.COMPLETED, q.status());
        assertEquals(10, q.offset());
    }

    @Test
    void givenMissingCustomer_whenSearch_thenInvalidQuery() {
        assertThrows(InvalidQueryException.class,
                () -> service.search(" ", null, null, null, null, null));
        assertThrows(InvalidQueryException.class,
                () -> service.search(null, null, null, null, null, null));
    }

    @Test
    void givenBadDateFormat_whenSearch_thenInvalidQuery() {
        assertThrows(InvalidQueryException.class,
                () -> service.search("CUST-0001", "01/09/2026", null, null, null, null));
    }

    @Test
    void givenFromAfterTo_whenSearch_thenInvalidQuery() {
        assertThrows(InvalidQueryException.class,
                () -> service.search("CUST-0001", "2026-10-02", "2026-10-01", null, null, null));
    }

    @Test
    void givenUnknownStatus_whenSearch_thenInvalidQuery() {
        assertThrows(InvalidQueryException.class,
                () -> service.search("CUST-0001", null, null, "CANCELLED", null, null));
    }

    @Test
    void givenOutOfRangePaging_whenSearch_thenInvalidQuery() {
        assertThrows(InvalidQueryException.class,
                () -> service.search("CUST-0001", null, null, null, -1, 10));
        assertThrows(InvalidQueryException.class,
                () -> service.search("CUST-0001", null, null, null, 0, 0));
        assertThrows(InvalidQueryException.class,
                () -> service.search("CUST-0001", null, null, null, 0, PaymentQueryService.MAX_SIZE + 1));
    }

    @Test
    void givenExistingPayment_whenGetById_thenReturnsIt() {
        assertEquals(SAMPLE, service.getById("CUST-0001", KNOWN_ID.toString()));
    }

    @Test
    void givenPaymentOfOtherCustomer_whenGetById_thenNotFound() {
        assertThrows(PaymentNotFoundException.class,
                () -> service.getById("CUST-0002", KNOWN_ID.toString()));
    }

    @Test
    void givenInvalidUuid_whenGetById_thenInvalidQuery() {
        assertThrows(InvalidQueryException.class, () -> service.getById("CUST-0001", "no-es-uuid"));
    }

    /** Doble en memoria del puerto de persistencia. */
    private static final class FakeRepository implements PaymentRepository {
        PaymentQuery lastQuery;

        @Override
        public List<Payment> find(PaymentQuery query) {
            lastQuery = query;
            return List.of(SAMPLE);
        }

        @Override
        public long count(PaymentQuery query) {
            return 1L;
        }

        @Override
        public Optional<Payment> findById(String customerId, UUID id) {
            return SAMPLE.customerId().equals(customerId) && SAMPLE.id().equals(id)
                    ? Optional.of(SAMPLE) : Optional.empty();
        }
    }
}
