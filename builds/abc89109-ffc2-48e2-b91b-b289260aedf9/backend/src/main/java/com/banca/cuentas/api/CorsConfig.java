package com.banca.cuentas.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private final String origenPermitido;

    public CorsConfig(@Value("${app.cors-origin:http://localhost:4200}") String origenPermitido) {
        this.origenPermitido = origenPermitido;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**").allowedOrigins(origenPermitido).allowedMethods("GET");
    }
}
