package com.banco.cards.application;

import java.util.UUID;

/** Puerto: identifica al cliente autenticado. La autenticacion real es externa (H1). */
public interface CustomerContext {

    UUID currentCustomerId();
}
