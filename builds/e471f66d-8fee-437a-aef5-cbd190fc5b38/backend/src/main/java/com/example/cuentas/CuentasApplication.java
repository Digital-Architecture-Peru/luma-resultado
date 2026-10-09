package com.example.cuentas;

import java.time.Clock;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CuentasApplication {

    public static void main(String[] args) {
        SpringApplication.run(CuentasApplication.class, args);
    }

    /** Reloj inyectable: permite fijar el tiempo en las pruebas. */
    @Bean
    Clock clock() {
        return Clock.systemUTC();
    }
}
