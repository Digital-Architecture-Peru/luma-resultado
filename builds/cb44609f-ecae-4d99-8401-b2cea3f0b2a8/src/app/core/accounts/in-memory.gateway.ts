import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable, defer, map, of, throwError, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AccountsGateway } from './accounts.gateway';
import { Account, GatewayError, TransferReceipt, TransferRequest } from './model';

export const GATEWAY_LATENCY_MS = new InjectionToken<number>('GATEWAY_LATENCY_MS', {
  providedIn: 'root',
  factory: () => environment.simulatedLatencyMs,
});

/** Palabra clave en el concepto que fuerza un error de servicio, para probar el estado de error. */
export const SIMULATED_ERROR_KEYWORD = 'simular-error';

function seedAccounts(): Account[] {
  return [
    { id: 'acc-001', alias: 'Cuenta Sueldo', maskedNumber: '****4821', balanceCents: 250000, currency: 'PEN' },
    { id: 'acc-002', alias: 'Ahorros', maskedNumber: '****7710', balanceCents: 120050, currency: 'PEN' },
    { id: 'acc-003', alias: 'Cuenta Corriente', maskedNumber: '****0395', balanceCents: 8000, currency: 'PEN' },
  ];
}

/** Adaptador en memoria para el cliente ficticio CLI-0001. El estado se pierde al recargar. */
@Injectable()
export class InMemoryAccountsGateway implements AccountsGateway {
  private readonly latencyMs = inject(GATEWAY_LATENCY_MS);
  private accounts: Account[] = seedAccounts();
  private readonly receipts = new Map<string, TransferReceipt>();
  private sequence = 0;

  listAccounts(): Observable<Account[]> {
    return this.respond(() => this.accounts.map((a) => ({ ...a })));
  }

  transfer(request: TransferRequest): Observable<TransferReceipt> {
    return this.respond(() => this.execute(request));
  }

  private execute(request: TransferRequest): TransferReceipt {
    const previous = this.receipts.get(request.operationId);
    if (previous) {
      return previous;
    }
    if (request.concept.toLowerCase().includes(SIMULATED_ERROR_KEYWORD)) {
      throw new GatewayError('UNAVAILABLE', 'El servicio no está disponible. Inténtalo nuevamente en unos minutos.');
    }
    if (!Number.isInteger(request.amountCents) || request.amountCents <= 0) {
      throw new GatewayError('INVALID_AMOUNT', 'El monto debe ser mayor a cero.');
    }
    if (request.fromId === request.toId) {
      throw new GatewayError('SAME_ACCOUNT', 'La cuenta de origen y destino deben ser distintas.');
    }
    const from = this.accounts.find((a) => a.id === request.fromId);
    const to = this.accounts.find((a) => a.id === request.toId);
    if (!from || !to) {
      throw new GatewayError('ACCOUNT_NOT_FOUND', 'No se encontró alguna de las cuentas.');
    }
    if (from.balanceCents < request.amountCents) {
      throw new GatewayError('INSUFFICIENT_FUNDS', 'Saldo insuficiente en la cuenta de origen.');
    }

    this.accounts = this.accounts.map((a) => {
      if (a.id === from.id) {
        return { ...a, balanceCents: a.balanceCents - request.amountCents };
      }
      if (a.id === to.id) {
        return { ...a, balanceCents: a.balanceCents + request.amountCents };
      }
      return a;
    });

    this.sequence += 1;
    const receipt: TransferReceipt = {
      operationId: request.operationId,
      reference: `TRX-${String(this.sequence).padStart(6, '0')}`,
      fromAlias: from.alias,
      toAlias: to.alias,
      amountCents: request.amountCents,
      currency: from.currency,
      concept: request.concept,
      executedAt: new Date().toISOString(),
    };
    this.receipts.set(request.operationId, receipt);
    return receipt;
  }

  private respond<T>(action: () => T): Observable<T> {
    return defer(() => {
      let value: T;
      try {
        value = action();
      } catch (error) {
        return throwError(() => error);
      }
      return this.latencyMs > 0 ? timer(this.latencyMs).pipe(map(() => value)) : of(value);
    });
  }
}
