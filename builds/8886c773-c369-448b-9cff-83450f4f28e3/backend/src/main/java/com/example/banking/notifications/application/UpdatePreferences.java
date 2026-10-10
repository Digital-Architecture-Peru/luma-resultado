package com.example.banking.notifications.application;

import com.example.banking.notifications.application.ports.AccountOwnership;
import com.example.banking.notifications.application.ports.PreferenceRepository;
import com.example.banking.notifications.domain.DomainException;
import com.example.banking.notifications.domain.Preference;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@ApplicationScoped
public class UpdatePreferences {

    private final PreferenceRepository repository;
    private final OwnershipGuard guard;

    public UpdatePreferences(PreferenceRepository repository, AccountOwnership ownership) {
        this.repository = repository;
        this.guard = new OwnershipGuard(ownership);
    }

    public List<Preference> execute(String customerId, String accountId, List<Preference> preferences) {
        guard.require(customerId, accountId);
        if (preferences == null) {
            throw new DomainException.InvalidRequest("preferences es obligatorio");
        }
        Set<String> seen = new HashSet<>();
        for (Preference p : preferences) {
            if (!accountId.equals(p.accountId())) {
                throw new DomainException.InvalidRequest("Preferencia de otra cuenta");
            }
            if (!seen.add(p.type() + ":" + p.channel())) {
                throw new DomainException.InvalidRequest("Preferencia duplicada: " + p.type() + "/" + p.channel());
            }
        }
        repository.replaceAll(accountId, preferences);
        return preferences;
    }
}
