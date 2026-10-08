package com.banco.cards.security;

/** Puerto: identifica al cliente autenticado. En producción lo implementa el canal (OAuth2/JWT). */
public interface CustomerContextProvider {

    String currentCustomerId();
}
