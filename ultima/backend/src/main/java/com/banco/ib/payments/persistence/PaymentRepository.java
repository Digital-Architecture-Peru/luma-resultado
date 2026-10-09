package com.banco.ib.payments.persistence;

import com.banco.ib.payments.domain.Payment;
import com.banco.ib.payments.domain.PaymentQuery;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Puerto de persistencia de solo lectura. */
public interface PaymentRepository {

    List<Payment> find(PaymentQuery query);

    long count(PaymentQuery query);

    Optional<Payment> findById(String customerId, UUID id);
}
