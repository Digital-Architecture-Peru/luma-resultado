package com.example.payments.application;

import com.example.payments.domain.Payment;
import com.example.payments.domain.PaymentRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class PaymentQueryService {

    private static final int MAX_PAGE_SIZE = 100;

    private final PaymentRepository repository;

    public PaymentQueryService(PaymentRepository repository) {
        this.repository = repository;
    }

    public Payment getById(UUID id) {
        return repository.findById(id).orElseThrow(() -> new PaymentNotFoundException(id));
    }

    public List<Payment> listByAccount(String account, int page, int size) {
        if (account == null || account.isBlank()) {
            throw new IllegalArgumentException("El parametro account es obligatorio");
        }
        if (page < 0 || size < 1 || size > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("page >= 0 y size entre 1 y " + MAX_PAGE_SIZE);
        }
        return repository.findBySourceAccount(account, page, size);
    }
}
