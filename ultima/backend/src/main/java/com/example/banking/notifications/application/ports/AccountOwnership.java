package com.example.banking.notifications.application.ports;

public interface AccountOwnership {

    boolean isOwner(String customerId, String accountId);
}
