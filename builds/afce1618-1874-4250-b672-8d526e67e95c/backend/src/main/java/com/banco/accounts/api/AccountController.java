package com.banco.accounts.api;

import com.banco.accounts.service.AccountService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    /** Identidad simulada; en produccion provendria del token autenticado. */
    static final String CUSTOMER_HEADER = "X-Customer-Id";

    private final AccountService service;

    public AccountController(AccountService service) {
        this.service = service;
    }

    @GetMapping
    public List<AccountDto> list(@RequestHeader(CUSTOMER_HEADER) String customerId) {
        return service.listAccounts(customerId).stream().map(AccountDto::from).toList();
    }

    @GetMapping("/{id}")
    public AccountDto detail(@RequestHeader(CUSTOMER_HEADER) String customerId,
                             @PathVariable long id) {
        return AccountDto.from(service.getAccount(customerId, id));
    }
}
