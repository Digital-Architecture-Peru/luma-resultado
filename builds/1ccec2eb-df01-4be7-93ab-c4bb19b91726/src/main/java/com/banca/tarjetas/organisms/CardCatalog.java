package com.banca.tarjetas.organisms;

import com.banca.tarjetas.model.Card;
import java.util.List;
import java.util.Optional;

/**
 * Puerto de lectura de tarjetas. La integración real con el core de tarjetas
 * está sin definir; hoy lo implementa un catálogo ficticio en memoria.
 */
public interface CardCatalog {

    List<Card> findAll();

    Optional<Card> findById(String id);
}
