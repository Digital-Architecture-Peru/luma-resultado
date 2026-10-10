package com.example.cuentas.notificaciones;

import java.time.Clock;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class NotificacionesApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificacionesApplication.class, args);
    }

    /** Reloj inyectable para que el tiempo sea controlable en pruebas. */
    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }
}
