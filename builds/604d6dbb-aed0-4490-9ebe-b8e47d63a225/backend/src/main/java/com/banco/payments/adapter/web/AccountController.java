package com.banco.payments.adapter.web;

import com.banco.payments.adapter.web.dto.AccountResponse;
import com.banco.payments.application.PaymentService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final PaymentService service;

    public AccountController(PaymentService service) {
        this.service = service;
    }

    @GetMapping
    public List<AccountResponse> list(
            @RequestHeader(value = "X-Customer-Id", defaultValue = "CUST-001") String customerId) {
        return service.accountsOf(customerId).stream().map(AccountResponse::from).toList();
    }
}
