package com.example.cuentas.infrastructure;

import com.example.cuentas.domain.Transfer;
import com.example.cuentas.domain.TransferRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaTransferRepository extends JpaRepository<Transfer, Long>, TransferRepository {

    @Override
    default Transfer add(Transfer transfer) {
        return save(transfer);
    }
}
