package com.banco.notificaciones.config;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Singleton;
import java.time.Clock;

/** Punto de composición del reloj (UTC); permite fijarlo en pruebas. */
@ApplicationScoped
public class ClockProducer {

    @Produces
    @Singleton
    public Clock clock() {
        return Clock.systemUTC();
    }
}
