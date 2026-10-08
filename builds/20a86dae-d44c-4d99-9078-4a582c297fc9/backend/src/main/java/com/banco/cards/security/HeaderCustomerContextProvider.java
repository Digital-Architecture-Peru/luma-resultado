package com.banco.cards.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/** SOLO DESARROLLO: toma el cliente ficticio del header X-Customer-Id. No usar en producción. */
@Component
@Profile("dev")
public class HeaderCustomerContextProvider implements CustomerContextProvider {

    public static final String HEADER = "X-Customer-Id";

    private final HttpServletRequest request;

    public HeaderCustomerContextProvider(HttpServletRequest request) {
        this.request = request;
    }

    @Override
    public String currentCustomerId() {
        String value = request.getHeader(HEADER);
        if (value == null || value.isBlank()) {
            throw new MissingCustomerException("Cliente no identificado");
        }
        return value.trim();
    }
}
