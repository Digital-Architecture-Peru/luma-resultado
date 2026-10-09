package com.banco.cards.domain;

public enum TransactionType {
    PURCHASE(true),
    PAYMENT(false),
    REFUND(false);

    private final boolean consumesBalance;

    TransactionType(boolean consumesBalance) {
        this.consumesBalance = consumesBalance;
    }

    public boolean consumesBalance() {
        return consumesBalance;
    }
}
