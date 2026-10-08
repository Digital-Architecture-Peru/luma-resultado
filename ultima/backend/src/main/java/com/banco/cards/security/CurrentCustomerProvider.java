package com.banco.cards.security;

/** Puerto hacia la autenticacion de Banca por Internet (integracion sin definir). */
public interface CurrentCustomerProvider {

    String currentCustomerId();
}
