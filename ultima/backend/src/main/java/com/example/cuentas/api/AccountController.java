package com.example.cuentas.api;

import com.example.cuentas.api.ApiDtos.AccountResponse;
import com.example.cuentas.api.ApiDtos.MovementPage;
import com.example.cuentas.application.AccountQueryService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class AccountController {

    private static final int MAX_PAGE_SIZE = 100;

    private final AccountQueryService queries;

    public AccountController(AccountQueryService queries) {
        this.queries = queries;
    }

    @GetMapping("/accounts")
    public List<AccountResponse> accounts(@RequestHeader("X-Customer-Id") String customerId) {
        return queries.listAccounts(customerId).stream().map(AccountResponse::from).toList();
    }

    @GetMapping("/accounts/{id}/movements")
    public MovementPage movements(@PathVariable Long id,
                                  @RequestHeader("X-Customer-Id") String customerId,
                                  @RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "20") int size) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        return MovementPage.from(queries.listMovements(customerId, id, safePage, safeSize));
    }
}
