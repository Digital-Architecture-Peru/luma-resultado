package com.banco.pagos.repository;

import com.banco.pagos.domain.FiltroPagos;
import com.banco.pagos.domain.Pago;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Parameters;
import io.quarkus.panache.common.Sort;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;

/** Adaptador PostgreSQL. Solo parametros nombrados: nunca se concatenan valores en la consulta. */
@ApplicationScoped
public class PagoPanacheRepository implements PagoRepository, PanacheRepositoryBase<Pago, Long> {

    private record Clausula(String where, Parameters params) {
    }

    @Override
    public List<Pago> buscar(FiltroPagos filtro, int page, int size) {
        Clausula c = construir(filtro);
        return find(c.where(), Sort.descending("fechaPago"), c.params())
                .page(Page.of(page, size))
                .list();
    }

    @Override
    public long contar(FiltroPagos filtro) {
        Clausula c = construir(filtro);
        return count(c.where(), c.params());
    }

    @Override
    public Optional<Pago> porId(Long id) {
        return findByIdOptional(id);
    }

    private static Clausula construir(FiltroPagos f) {
        StringBuilder where = new StringBuilder("cuentaId = :cuentaId");
        Parameters params = Parameters.with("cuentaId", f.cuentaId());
        if (f.desde() != null) {
            where.append(" and fechaPago >= :desde");
            params.and("desde", f.desde());
        }
        if (f.hasta() != null) {
            where.append(" and fechaPago <= :hasta");
            params.and("hasta", f.hasta());
        }
        if (f.estado() != null) {
            where.append(" and estado = :estado");
            params.and("estado", f.estado());
        }
        return new Clausula(where.toString(), params);
    }
}
