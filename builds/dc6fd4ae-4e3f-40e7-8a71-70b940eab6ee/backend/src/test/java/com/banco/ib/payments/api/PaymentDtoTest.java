package com.banco.ib.payments.api;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import com.banco.ib.payments.api.dto.PaymentDto;
import com.banco.ib.payments.domain.Payment;
import com.banco.ib.payments.domain.PaymentStatus;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class PaymentDtoTest {

    @Test
    void givenPendingPayment_whenMapped_thenAmountIsStringAndExecutedAtNull() {
        Payment p = new Payment(UUID.fromString("11111111-1111-4111-8111-111111111103"), "CUST-0001",
                "PAGO-0003", "Telecom Ficticia", "****9012", new BigDecimal("89.90"), "USD",
                PaymentStatus.PENDING, null);

        PaymentDto dto = PaymentDto.from(p);

        assertEquals("89.90", dto.amount());
        assertEquals("PENDING", dto.status());
        assertNull(dto.executedAt());
    }
}
