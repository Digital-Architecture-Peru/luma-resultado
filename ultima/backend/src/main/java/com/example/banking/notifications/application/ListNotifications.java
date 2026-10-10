package com.example.banking.notifications.application;

import com.example.banking.notifications.application.ports.AccountOwnership;
import com.example.banking.notifications.application.ports.NotificationRepository;
import com.example.banking.notifications.domain.DomainException;
import com.example.banking.notifications.domain.Notification;
import com.example.banking.notifications.domain.NotificationStatus;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ListNotifications {

    static final int MAX_PAGE_SIZE = 100;

    private final NotificationRepository repository;
    private final OwnershipGuard guard;

    public ListNotifications(NotificationRepository repository, AccountOwnership ownership) {
        this.repository = repository;
        this.guard = new OwnershipGuard(ownership);
    }

    public List<Notification> execute(String customerId, String accountId,
                                      Optional<NotificationStatus> status, int page, int size) {
        guard.require(customerId, accountId);
        if (page < 0) {
            throw new DomainException.InvalidRequest("page debe ser >= 0");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new DomainException.InvalidRequest("size debe estar entre 1 y " + MAX_PAGE_SIZE);
        }
        return repository.findByAccount(accountId, status, page, size);
    }
}
