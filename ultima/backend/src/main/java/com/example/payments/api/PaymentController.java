package com.example.payments.api;

import com.example.payments.api.dto.CreatePaymentRequest;
import com.example.payments.api.dto.PaymentResponse;
import com.example.payments.application.CreatePaymentService;
import com.example.payments.application.PaymentQueryService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final CreatePaymentService createService;
    private final PaymentQueryService queryService;

    public PaymentController(CreatePaymentService createService, PaymentQueryService queryService) {
        this.createService = createService;
        this.queryService = queryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentResponse create(@RequestHeader("Idempotency-Key") String idempotencyKey,
                                  @Valid @RequestBody CreatePaymentRequest body) {
        var command = new CreatePaymentService.Command(idempotencyKey, body.sourceAccount(),
                body.beneficiary(), body.amount(), body.currency(), body.reference());
        return PaymentResponse.from(createService.create(command));
    }

    @GetMapping("/{id}")
    public PaymentResponse get(@PathVariable UUID id) {
        return PaymentResponse.from(queryService.getById(id));
    }

    @GetMapping
    public List<PaymentResponse> list(@RequestParam String account,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "20") int size) {
        return queryService.listByAccount(account, page, size).stream().map(PaymentResponse::from).toList();
    }
}
