package com.example.cuentas.api;

import com.example.cuentas.api.ApiDtos.TransferRequest;
import com.example.cuentas.api.ApiDtos.TransferResponse;
import com.example.cuentas.application.TransferService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class TransferController {

    private static final int MAX_KEY_LENGTH = 64;

    private final TransferService service;

    public TransferController(TransferService service) {
        this.service = service;
    }

    /** 201 si la transferencia es nueva; 200 si es un reintento idempotente. */
    @PostMapping("/transfers")
    public ResponseEntity<TransferResponse> create(
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @RequestHeader("X-Customer-Id") String customerId,
            @Valid @RequestBody TransferRequest body) {
        if (idempotencyKey.isBlank() || idempotencyKey.length() > MAX_KEY_LENGTH) {
            throw new IllegalArgumentException("Idempotency-Key debe tener entre 1 y 64 caracteres.");
        }
        TransferService.Result result = service.execute(new TransferService.Command(
                customerId, idempotencyKey, body.sourceAccountId(), body.targetAccountId(),
                body.amount(), body.currency(), body.description()));
        HttpStatus status = result.replayed() ? HttpStatus.OK : HttpStatus.CREATED;
        return ResponseEntity.status(status).body(TransferResponse.from(result.transfer()));
    }
}
