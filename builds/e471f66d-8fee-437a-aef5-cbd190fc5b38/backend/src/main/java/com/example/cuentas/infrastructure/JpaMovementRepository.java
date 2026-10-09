package com.example.cuentas.infrastructure;

import com.example.cuentas.domain.Movement;
import com.example.cuentas.domain.MovementRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaMovementRepository extends JpaRepository<Movement, Long>, MovementRepository {

    @Override
    default Movement add(Movement movement) {
        return save(movement);
    }
}
