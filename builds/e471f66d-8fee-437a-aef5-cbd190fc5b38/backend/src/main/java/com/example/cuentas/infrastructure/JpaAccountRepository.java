package com.example.cuentas.infrastructure;

import com.example.cuentas.domain.Account;
import com.example.cuentas.domain.AccountRepository;
import jakarta.persistence.LockModeType;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JpaAccountRepository extends JpaRepository<Account, Long>, AccountRepository {

    @Override
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Account a where a.id in :ids order by a.id")
    List<Account> lockByIds(@Param("ids") Collection<Long> ids);
}
