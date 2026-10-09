package com.bank.cards.notifications.adapter;

import jakarta.enterprise.inject.Produces;
import jakarta.inject.Singleton;
import java.time.Clock;

/** Reloj inyectable para que el servicio sea determinista en pruebas. */
public class ClockProducer {

    @Produces
    @Singleton
    public Clock clock() {
        return Clock.systemUTC();
    }
}
