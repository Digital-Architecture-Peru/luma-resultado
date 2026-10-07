import type { Account, Beneficiary, PaymentReceipt, PaymentRequest } from '../domain/payment';

/** Puerto de integración (sin definir): se sustituirá por un adaptador HTTP real. */
export interface PaymentGateway {
  listAccounts(): Promise<Account[]>;
  listBeneficiaries(): Promise<Beneficiary[]>;
  submit(request: PaymentRequest): Promise<PaymentReceipt>;
}

/** Adaptador en memoria con datos ficticios (persistencia sin definir). */
export class InMemoryPaymentGateway implements PaymentGateway {
  private accounts: Account[];
  private readonly beneficiaries: Beneficiary[];
  private sequence = 0;

  constructor(accounts?: Account[], beneficiaries?: Beneficiary[]) {
    this.accounts = (accounts ?? defaultAccounts()).map((a) => ({ ...a }));
    this.beneficiaries = (beneficiaries ?? defaultBeneficiaries()).map((b) => ({ ...b }));
  }

  async listAccounts(): Promise<Account[]> {
    return this.accounts.map((a) => ({ ...a }));
  }

  async listBeneficiaries(): Promise<Beneficiary[]> {
    return this.beneficiaries.map((b) => ({ ...b }));
  }

  async submit(request: PaymentRequest): Promise<PaymentReceipt> {
    const account = this.accounts.find((a) => a.id === request.sourceAccountId);
    if (!account) throw new Error('Cuenta de origen no encontrada.');
    if (!this.beneficiaries.some((b) => b.id === request.beneficiaryId)) {
      throw new Error('Beneficiario no encontrado.');
    }
    if (request.amount > account.balance) throw new Error('Saldo insuficiente.');

    account.balance = Math.round((account.balance - request.amount) * 100) / 100;
    this.sequence += 1;
    return {
      reference: `PAG-${String(this.sequence).padStart(6, '0')}`,
      request: { ...request },
      newBalance: account.balance
    };
  }
}

function defaultAccounts(): Account[] {
  return [
    { id: 'acc-1', alias: 'Cuenta Sueldo', maskedNumber: '****4821', balance: 5200.75 },
    { id: 'acc-2', alias: 'Cuenta Ahorros', maskedNumber: '****9034', balance: 12850 }
  ];
}

function defaultBeneficiaries(): Beneficiary[] {
  return [
    { id: 'ben-1', name: 'Servicios Eléctricos Demo S.A.', maskedNumber: '****1100' },
    { id: 'ben-2', name: 'Colegio Ejemplo', maskedNumber: '****7765' },
    { id: 'ben-3', name: 'Ana Pérez (ficticia)', maskedNumber: '****3092' }
  ];
}
