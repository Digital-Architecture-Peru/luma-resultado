package com.banco.payments.adapter.web;

import com.banco.payments.adapter.web.dto.CreatePaymentRequest;
import com.banco.payments.adapter.web.dto.PaymentResponse;
import com.banco.payments.application.PaymentCommand;
import com.banco.payments.application.PaymentErrors;
import com.banco.payments.application.PaymentService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private static final int MAX_KEY_LENGTH = 64;
    // La autenticacion la provee Banca por Internet; aqui el cliente llega simulado.
    private static final String DEFAULT_CUSTOMER = "CUST-001";

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PaymentResponse> create(
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @RequestHeader(value = "X-Customer-Id", defaultValue = DEFAULT_CUSTOMER) String customerId,
            @Valid @RequestBody CreatePaymentRequest body) {
        requireValidKey(idempotencyKey);
        var payment = service.create(new PaymentCommand(customerId, idempotencyKey,
                body.sourceAccountId(), body.targetAccount(), body.amount(), body.currency(), body.reference()));
        return ResponseEntity.created(URI.create("/api/v1/payments/" + payment.id()))
                .body(PaymentResponse.from(payment));
    }

    @GetMapping("/{id}")
    public PaymentResponse get(
            @PathVariable UUID id,
            @RequestHeader(value = "X-Customer-Id", defaultValue = DEFAULT_CUSTOMER) String customerId) {
        return PaymentResponse.from(service.get(id, customerId));
    }

    private static void requireValidKey(String key) {
        if (key.isBlank() || key.length() > MAX_KEY_LENGTH) {
            throw new PaymentErrors.InvalidPayment("Idempotency-Key debe tener entre 1 y 64 caracteres");
        }
    }
}
