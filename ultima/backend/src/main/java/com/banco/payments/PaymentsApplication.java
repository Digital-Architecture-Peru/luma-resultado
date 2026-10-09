package com.banco.payments;

import java.time.Clock;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class PaymentsApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentsApplication.class, args);
    }

    /** Reloj inyectable para que el dominio sea determinista en pruebas. */
    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }
}
