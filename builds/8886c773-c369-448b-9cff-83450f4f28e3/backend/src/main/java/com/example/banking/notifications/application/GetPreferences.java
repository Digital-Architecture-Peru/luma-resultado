package com.example.banking.notifications.application;

import com.example.banking.notifications.application.ports.AccountOwnership;
import com.example.banking.notifications.application.ports.PreferenceRepository;
import com.example.banking.notifications.domain.Preference;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class GetPreferences {

    private final PreferenceRepository repository;
    private final OwnershipGuard guard;

    public GetPreferences(PreferenceRepository repository, AccountOwnership ownership) {
        this.repository = repository;
        this.guard = new OwnershipGuard(ownership);
    }

    public List<Preference> execute(String customerId, String accountId) {
        guard.require(customerId, accountId);
        return repository.findByAccount(accountId);
    }
}
