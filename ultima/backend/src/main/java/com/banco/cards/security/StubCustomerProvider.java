package com.banco.cards.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Implementacion provisional: devuelve un cliente ficticio fijo configurable. */
@Component
public class StubCustomerProvider implements CurrentCustomerProvider {

    private final String customerId;

    public StubCustomerProvider(@Value("${app.stub-customer-id:CUST-0001}") String customerId) {
        this.customerId = customerId;
    }

    @Override
    public String currentCustomerId() {
        return customerId;
    }
}
