package com.banco.cuentas.api;

import com.banco.cuentas.domain.Account;
import com.banco.cuentas.domain.Movement;
import com.banco.cuentas.domain.Transfer;

/** DTOs del contrato REST. Los montos viajan como string decimal (sin perdida de precision). */
public final class ApiDtos {

    private ApiDtos() {
    }

    public record AccountDto(long id, String numberMasked, String currency, String balance) {
        public static AccountDto from(Account a) {
            return new AccountDto(a.id(), a.numberMasked(), a.currency(), a.balance().toPlainString());
        }
    }

    public record TransferRequest(Long sourceAccountId, Long targetAccountId, String amount, String currency,
                                  String description) {
    }

    public record TransferResponse(String transferId, String status, String createdAt) {
        public static TransferResponse from(Transfer t) {
            return new TransferResponse(t.id().toString(), t.status(), t.createdAt().toString());
        }
    }

    public record MovementDto(long id, long accountId, String transferId, String type, String amount,
                              String createdAt) {
        public static MovementDto from(Movement m) {
            return new MovementDto(m.id() == null ? 0 : m.id(), m.accountId(), m.transferId().toString(),
                    m.type().name(), m.amount().toPlainString(), m.createdAt().toString());
        }
    }
}
