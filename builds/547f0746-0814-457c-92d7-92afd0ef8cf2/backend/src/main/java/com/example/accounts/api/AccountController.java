package com.example.accounts.api;

import com.example.accounts.application.AccountQueryService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * El customerId llega por la cabecera X-Customer-Id (stub). NO apto para producción:
 * debe sustituirse por la identidad autenticada.
 */
@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountQueryService service;

    public AccountController(AccountQueryService service) {
        this.service = service;
    }

    @GetMapping
    public List<AccountResponse> list(@RequestHeader("X-Customer-Id") long customerId) {
        return service.listAccounts(customerId).stream().map(AccountResponse::from).toList();
    }

    @GetMapping("/{id}/movements")
    public List<MovementResponse> movements(@RequestHeader("X-Customer-Id") long customerId,
                                            @PathVariable long id,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "20") int size) {
        return service.listMovements(customerId, id, page, size).stream().map(MovementResponse::from).toList();
    }
}
