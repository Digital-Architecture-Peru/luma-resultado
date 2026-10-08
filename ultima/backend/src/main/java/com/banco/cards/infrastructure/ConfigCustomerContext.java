package com.banco.cards.infrastructure;

import com.banco.cards.application.CustomerContext;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.UUID;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/** Stub configurable por entorno; reemplazar por identidad OIDC/JWT. */
@ApplicationScoped
public class ConfigCustomerContext implements CustomerContext {

    private final UUID customerId;

    public ConfigCustomerContext(@ConfigProperty(name = "cards.demo-customer-id") String customerId) {
        this.customerId = UUID.fromString(customerId);
    }

    @Override
    public UUID currentCustomerId() {
        return customerId;
    }
}
