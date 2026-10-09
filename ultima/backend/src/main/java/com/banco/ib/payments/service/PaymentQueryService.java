package com.banco.ib.payments.service;

import com.banco.ib.payments.domain.PageResult;
import com.banco.ib.payments.domain.Payment;
import com.banco.ib.payments.domain.PaymentQuery;
import com.banco.ib.payments.domain.PaymentStatus;
import com.banco.ib.payments.persistence.PaymentRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.UUID;

/** Valida criterios de consulta y delega en el repositorio. Sin dependencias de infraestructura. */
@ApplicationScoped
public class PaymentQueryService {

    static final int DEFAULT_SIZE = 20;
    static final int MAX_SIZE = 100;

    private final PaymentRepository repository;

    public PaymentQueryService(PaymentRepository repository) {
        this.repository = repository;
    }

    public PageResult<Payment> search(String customerId, String from, String to, String status,
                                      Integer page, Integer size) {
        String customer = requireCustomer(customerId);
        Instant fromInstant = parseStart(from, "from");
        Instant toExclusive = parseEndExclusive(to, "to");
        if (fromInstant != null && toExclusive != null && !fromInstant.isBefore(toExclusive)) {
            throw new InvalidQueryException("'from' no puede ser posterior a 'to'");
        }
        int pageNumber = page == null ? 0 : page;
        int pageSize = size == null ? DEFAULT_SIZE : size;
        if (pageNumber < 0) {
            throw new InvalidQueryException("'page' debe ser mayor o igual a 0");
        }
        if (pageSize < 1 || pageSize > MAX_SIZE) {
            throw new InvalidQueryException("'size' debe estar entre 1 y " + MAX_SIZE);
        }
        PaymentQuery query = new PaymentQuery(customer, fromInstant, toExclusive,
                parseStatus(status), pageNumber, pageSize);
        return new PageResult<>(repository.find(query), pageNumber, pageSize, repository.count(query));
    }

    public Payment getById(String customerId, String id) {
        String customer = requireCustomer(customerId);
        UUID uuid = parseUuid(id);
        return repository.findById(customer, uuid)
                .orElseThrow(() -> new PaymentNotFoundException("Pago no encontrado"));
    }

    private static String requireCustomer(String customerId) {
        if (customerId == null || customerId.isBlank() || customerId.length() > 36) {
            throw new InvalidQueryException("Header X-Customer-Id requerido (máx. 36 caracteres)");
        }
        return customerId.trim();
    }

    private static Instant parseStart(String value, String name) {
        LocalDate date = parseDate(value, name);
        return date == null ? null : date.atStartOfDay(ZoneOffset.UTC).toInstant();
    }

    private static Instant parseEndExclusive(String value, String name) {
        LocalDate date = parseDate(value, name);
        return date == null ? null : date.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
    }

    private static LocalDate parseDate(String value, String name) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException e) {
            throw new InvalidQueryException("'" + name + "' debe tener formato AAAA-MM-DD");
        }
    }

    private static PaymentStatus parseStatus(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return PaymentStatus.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidQueryException("'status' debe ser PENDING, COMPLETED o REJECTED");
        }
    }

    private static UUID parseUuid(String id) {
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new InvalidQueryException("'id' debe ser un UUID válido");
        }
    }
}
