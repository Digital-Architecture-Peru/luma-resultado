package com.banco.pagos.infrastructure;

import com.banco.pagos.domain.Pago;
import com.banco.pagos.domain.PagoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/** Adaptador JPA hacia PostgreSQL; todas las consultas usan parámetros enlazados. */
@ApplicationScoped
public class PagoJpaRepository implements PagoRepository {

    private final EntityManager em;

    public PagoJpaRepository(EntityManager em) {
        this.em = em;
    }

    @Override
    @Transactional
    public Pago guardar(Pago pago) {
        return em.merge(PagoEntity.desde(pago)).aDominio();
    }

    @Override
    public Optional<Pago> buscarPorId(UUID id) {
        return Optional.ofNullable(em.find(PagoEntity.class, id)).map(PagoEntity::aDominio);
    }

    @Override
    public Optional<Pago> buscarPorIdempotencyKey(String idempotencyKey) {
        return em.createQuery("select p from PagoEntity p where p.idempotencyKey = :clave", PagoEntity.class)
                .setParameter("clave", idempotencyKey)
                .getResultStream()
                .findFirst()
                .map(PagoEntity::aDominio);
    }

    @Override
    public List<Pago> listarPorCuentaOrigen(String cuentaOrigen, int limite) {
        return em.createQuery(
                        "select p from PagoEntity p where p.cuentaOrigen = :cuenta order by p.creadoEn desc",
                        PagoEntity.class)
                .setParameter("cuenta", cuentaOrigen)
                .setMaxResults(limite)
                .getResultList()
                .stream()
                .map(PagoEntity::aDominio)
                .toList();
    }
}
