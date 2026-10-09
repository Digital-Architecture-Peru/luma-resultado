package com.example.cards.domain;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.cards.domain.DomainErrors.ConcurrentUpdateException;
import com.example.cards.domain.DomainErrors.DuplicatePaymentException;
import com.example.cards.domain.DomainErrors.NotFoundException;
import com.example.cards.domain.DomainErrors.PaymentRejectedException;
import com.example.cards.port.CardRepository;
import com.example.cards.port.CoreBankingPort;
import java.math.BigDecimal;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    private static final String CUSTOMER = "cust-001";
    private static final Instant NOW = Instant.parse("2026-10-09T20:00:00Z");

    @Mock
    private CardRepository repository;
    @Mock
    private CoreBankingPort coreBanking;

    private PaymentService service;

    @BeforeEach
    void setUp() {
        service = new PaymentService(repository, coreBanking, Clock.fixed(NOW, ZoneOffset.UTC));
    }

    private void givenCardAndAccount(String cardBalance, String accountBalance) {
        when(repository.findCard(CUSTOMER, "card-1")).thenReturn(Optional.of(
                new Card("card-1", CUSTOMER, "4242", "VISA", new BigDecimal("5000.00"), new BigDecimal(cardBalance), 3)));
        when(repository.findAccount(CUSTOMER, "acc-1")).thenReturn(Optional.of(
                new Account("acc-1", CUSTOMER, "Ahorros", new BigDecimal(accountBalance), 7)));
    }

    private PaymentCommand command(String amount) {
        return new PaymentCommand("acc-1", new BigDecimal(amount), "key-1");
    }

    @Test
    void givenValidPayment_whenPay_thenDebitsCreditsAndStoresTransaction() {
        givenCardAndAccount("1250.50", "2500.00");
        when(repository.debitAccount("acc-1", new BigDecimal("150.00"), 7)).thenReturn(true);
        when(repository.reduceCardBalance("card-1", new BigDecimal("150.00"), 3)).thenReturn(true);
        when(repository.saveTransaction(any())).thenAnswer(i -> i.getArgument(0));

        CardTransaction tx = service.pay(CUSTOMER, "card-1", command("150.00"));

        assertEquals("PAYMENT", tx.type());
        assertEquals("POSTED", tx.status());
        assertEquals(new BigDecimal("150.00"), tx.amount());
        assertEquals("key-1", tx.idempotencyKey());
        assertEquals(NOW, tx.createdAt());
        verify(coreBanking).postPayment("card-1", "acc-1", new BigDecimal("150.00"));
    }

    @Test
    void givenExistingIdempotencyKey_whenPay_thenThrowsDuplicate() {
        when(repository.findByIdempotencyKey("key-1")).thenReturn(Optional.of(
                new CardTransaction("tx-9", "card-1", "PAYMENT", BigDecimal.TEN, "POSTED", "key-1", NOW)));

        assertThrows(DuplicatePaymentException.class, () -> service.pay(CUSTOMER, "card-1", command("10.00")));
        verify(repository, never()).saveTransaction(any());
    }

    @Test
    void givenInsufficientFunds_whenPay_thenRejectedWithoutMovingMoney() {
        givenCardAndAccount("1250.50", "10.00");

        assertThrows(PaymentRejectedException.class, () -> service.pay(CUSTOMER, "card-1", command("150.00")));
        verify(repository, never()).debitAccount(any(), any(), org.mockito.ArgumentMatchers.anyLong());
        verify(repository, never()).saveTransaction(any());
    }

    @Test
    void givenAmountAboveCardDebt_whenPay_thenRejected() {
        givenCardAndAccount("100.00", "2500.00");

        assertThrows(PaymentRejectedException.class, () -> service.pay(CUSTOMER, "card-1", command("150.00")));
    }

    @Test
    void givenNonPositiveAmount_whenPay_thenRejected() {
        assertThrows(PaymentRejectedException.class, () -> service.pay(CUSTOMER, "card-1", command("0.00")));
        assertThrows(PaymentRejectedException.class, () -> service.pay(CUSTOMER, "card-1", command("-5.00")));
    }

    @Test
    void givenMoreThanTwoDecimals_whenPay_thenRejected() {
        assertThrows(PaymentRejectedException.class, () -> service.pay(CUSTOMER, "card-1", command("10.001")));
    }

    @Test
    void givenUnknownCard_whenPay_thenNotFound() {
        when(repository.findCard(CUSTOMER, "card-1")).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.pay(CUSTOMER, "card-1", command("10.00")));
    }

    @Test
    void givenStaleVersion_whenPay_thenConcurrentUpdate() {
        givenCardAndAccount("1250.50", "2500.00");
        when(repository.debitAccount("acc-1", new BigDecimal("50.00"), 7)).thenReturn(false);

        assertThrows(ConcurrentUpdateException.class, () -> service.pay(CUSTOMER, "card-1", command("50.00")));
        verify(repository, never()).saveTransaction(any());
    }
}
