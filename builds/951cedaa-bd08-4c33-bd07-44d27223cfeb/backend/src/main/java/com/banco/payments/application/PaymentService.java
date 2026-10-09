package com.banco.payments.application;

import com.banco.payments.domain.DuplicateIdempotencyKeyException;
import com.banco.payments.domain.Payment;
import com.banco.payments.domain.PaymentNotFoundException;
import com.banco.payments.domain.PaymentRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.math.BigDecimal;
import java.time.Clock;
import java.util.UUID;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

@ApplicationScoped
public class PaymentService {

    private static final Logger LOG = Logger.getLogger(PaymentService.class);

    private final PaymentRepository repository;
    private final PaymentGateway gateway;
    private final Clock clock;
    private final BigDecimal maxAmount;

    /**
     * Constructor de CDI. Al existir dos constructores, ArC exige @Inject para saber
     * cuál usar; sin él el bean se descarta ("does not declare a valid bean constructor").
     */
    @Inject
    public PaymentService(PaymentRepository repository, PaymentGateway gateway,
                          @ConfigProperty(name = "payments.max-amount") BigDecimal maxAmount) {
        this(repository, gateway, Clock.systemUTC(), maxAmount);
    }

    /** Constructor para pruebas unitarias con reloj fijo (no lo usa CDI). */
    PaymentService(PaymentRepository repository, PaymentGateway gateway, Clock clock,
                   BigDecimal maxAmount) {
        this.repository = repository;
        this.gateway = gateway;
        this.clock = clock;
        this.maxAmount = maxAmount;
    }

    public Payment create(CreatePaymentCommand cmd) {
        if (cmd.idempotencyKey() != null
                && repository.findByIdempotencyKey(cmd.idempotencyKey()).isPresent()) {
            throw new DuplicateIdempotencyKeyException(cmd.idempotencyKey());
        }
        Payment pending = Payment.create(cmd.originAccount(), cmd.beneficiary(), cmd.amount(),
                cmd.currency(), cmd.concept(), cmd.idempotencyKey(), maxAmount, clock.instant());
        Payment result = gateway.authorize(pending) ? pending.confirm() : pending.reject();
        repository.save(result);
        LOG.infof("Pago %s desde cuenta %s: %s", result.id(), result.maskedOriginAccount(),
                result.status());
        return result;
    }

    public Payment get(UUID id) {
        return repository.findById(id).orElseThrow(() -> new PaymentNotFoundException(id));
    }
}
