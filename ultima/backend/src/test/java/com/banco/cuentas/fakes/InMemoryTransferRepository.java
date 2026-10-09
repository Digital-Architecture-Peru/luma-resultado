package com.banco.cuentas.fakes;

import com.banco.cuentas.domain.Movement;
import com.banco.cuentas.domain.Transfer;
import com.banco.cuentas.persistence.TransferRepository;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

public class InMemoryTransferRepository implements TransferRepository {

    private final List<Transfer> transfers = new ArrayList<>();
    private final List<Movement> movements = new ArrayList<>();

    public List<Movement> allMovements() {
        return List.copyOf(movements);
    }

    public int transferCount() {
        return transfers.size();
    }

    @Override
    public Optional<Transfer> findByIdempotencyKey(String key) {
        return transfers.stream().filter(t -> t.idempotencyKey().equals(key)).findFirst();
    }

    @Override
    public void insert(Transfer transfer) {
        transfers.add(transfer);
    }

    @Override
    public void insertMovement(Movement movement) {
        movements.add(movement);
    }

    @Override
    public List<Movement> findMovements(long accountId, int page, int size) {
        return movements.stream()
                .filter(m -> m.accountId() == accountId)
                .sorted(Comparator.comparing(Movement::createdAt).reversed())
                .skip((long) page * size)
                .limit(size)
                .toList();
    }
}
