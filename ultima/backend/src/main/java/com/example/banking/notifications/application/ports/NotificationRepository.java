package com.example.banking.notifications.application.ports;

import com.example.banking.notifications.domain.Notification;
import com.example.banking.notifications.domain.NotificationStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificationRepository {

    List<Notification> findByAccount(String accountId, Optional<NotificationStatus> status, int page, int size);

    Optional<Notification> findById(UUID id);

    void save(Notification notification);
}
