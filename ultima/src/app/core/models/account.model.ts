export interface Account {
  readonly id: string;
  readonly alias: string;
  readonly number: string;
  readonly currency: 'PEN';
  readonly balance: number;
}

export interface TransferRequest {
  readonly sourceId: string;
  readonly targetId: string;
  readonly amount: number;
  readonly concept: string;
}

export interface Movement {
  readonly reference: string;
  readonly date: string;
  readonly sourceId: string;
  readonly targetId: string;
  readonly amount: number;
  readonly concept: string;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
