package com.example.accounts.api;

import com.example.accounts.application.TransferService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/transfers")
@Validated
public class TransferController {

    private final TransferService service;

    public TransferController(TransferService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransferResponse create(@RequestHeader("X-Customer-Id") long customerId,
                                   @RequestHeader("Idempotency-Key") @NotBlank @Size(max = 64) String idempotencyKey,
                                   @Valid @RequestBody TransferRequest request) {
        return TransferResponse.from(service.execute(customerId, idempotencyKey, request.toCommand()));
    }
}
