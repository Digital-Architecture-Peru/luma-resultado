package com.example.cuentas.api;

import com.example.cuentas.domain.Account;
import com.example.cuentas.domain.Movement;
import com.example.cuentas.domain.Transfer;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Page;

/** DTOs de la API v1, separados de las entidades de dominio. */
public final class ApiDtos {

    private ApiDtos() { }

    public record TransferRequest(
            @NotNull Long sourceAccountId,
            @NotNull Long targetAccountId,
            @NotNull @Positive @Digits(integer = 17, fraction = 2) BigDecimal amount,
            @NotBlank @Pattern(regexp = "[A-Z]{3}") String currency,
            @Size(max = 140) String description) { }

    public record AccountResponse(Long id, String number, String holder, String currency, BigDecimal balance) {
        public static AccountResponse from(Account a) {
            return new AccountResponse(a.getId(), a.getNumber(), a.getHolder(), a.getCurrency(), a.getBalance());
        }
    }

    public record TransferResponse(Long id, String status, Long sourceAccountId, Long targetAccountId,
                                   BigDecimal amount, String currency, String description, Instant createdAt) {
        public static TransferResponse from(Transfer t) {
            return new TransferResponse(t.getId(), t.getStatus(), t.getSourceId(), t.getTargetId(),
                    t.getAmount(), t.getCurrency(), t.getDescription(), t.getCreatedAt());
        }
    }

    public record MovementResponse(Long id, Long transferId, String type, BigDecimal amount, Instant createdAt) {
        public static MovementResponse from(Movement m) {
            return new MovementResponse(m.getId(), m.getTransferId(), m.getType().name(),
                    m.getAmount(), m.getCreatedAt());
        }
    }

    public record MovementPage(List<MovementResponse> content, int page, int size,
                               long totalElements, int totalPages) {
        public static MovementPage from(Page<Movement> p) {
            return new MovementPage(p.getContent().stream().map(MovementResponse::from).toList(),
                    p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages());
        }
    }
}
