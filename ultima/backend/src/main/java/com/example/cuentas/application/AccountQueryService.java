package com.example.cuentas.application;

import com.example.cuentas.domain.Account;
import com.example.cuentas.domain.AccountRepository;
import com.example.cuentas.domain.DomainException;
import com.example.cuentas.domain.Movement;
import com.example.cuentas.domain.MovementRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Consultas de cuentas y movimientos del cliente. */
@Service
@Transactional(readOnly = true)
public class AccountQueryService {

    private final AccountRepository accounts;
    private final MovementRepository movements;

    public AccountQueryService(AccountRepository accounts, MovementRepository movements) {
        this.accounts = accounts;
        this.movements = movements;
    }

    public List<Account> listAccounts(String customerId) {
        return accounts.findByCustomerIdOrderByIdAsc(customerId);
    }

    public Page<Movement> listMovements(String customerId, Long accountId, int page, int size) {
        Account account = accounts.findById(accountId)
                .filter(a -> a.belongsTo(customerId))
                .orElseThrow(() -> DomainException.notFound("ACCOUNT_NOT_FOUND", "Cuenta no encontrada."));
        return movements.findByAccountIdOrderByCreatedAtDescIdDesc(account.getId(), PageRequest.of(page, size));
    }
}
