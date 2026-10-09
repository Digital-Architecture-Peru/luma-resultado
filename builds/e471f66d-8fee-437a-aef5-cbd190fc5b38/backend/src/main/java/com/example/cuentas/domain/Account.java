package com.example.cuentas.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "account")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String number;

    @Column(nullable = false)
    private String holder;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(nullable = false)
    private String currency;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance;

    protected Account() {
        // requerido por JPA
    }

    public Account(Long id, String number, String holder, String customerId, String currency, BigDecimal balance) {
        this.id = id;
        this.number = number;
        this.holder = holder;
        this.customerId = customerId;
        this.currency = currency;
        this.balance = balance;
    }

    public void debit(BigDecimal amount) {
        requirePositive(amount);
        if (balance.compareTo(amount) < 0) {
            throw DomainException.businessRule("INSUFFICIENT_FUNDS", "Saldo insuficiente en la cuenta origen.");
        }
        balance = balance.subtract(amount);
    }

    public void credit(BigDecimal amount) {
        requirePositive(amount);
        balance = balance.add(amount);
    }

    public boolean belongsTo(String customer) {
        return customerId.equals(customer);
    }

    private static void requirePositive(BigDecimal amount) {
        if (amount == null || amount.signum() <= 0) {
            throw DomainException.businessRule("INVALID_AMOUNT", "El monto debe ser mayor que cero.");
        }
    }

    public Long getId() { return id; }
    public String getNumber() { return number; }
    public String getHolder() { return holder; }
    public String getCustomerId() { return customerId; }
    public String getCurrency() { return currency; }
    public BigDecimal getBalance() { return balance; }
}
