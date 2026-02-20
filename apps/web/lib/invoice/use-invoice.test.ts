import { describe, expect, it } from 'vitest';
import {
  buildInitialInvoiceState,
  buildTrackerView,
  invoiceReducer,
} from './use-invoice';
import type { InvoiceNormalizedResponse } from './payment';

describe('useInvoice reducer and tracker view', () => {
  it('derives selecting phase from pending invoice without deposit instructions', () => {
    const invoice = createInvoice({
      status: 'PENDING',
      depositAddress: null,
      currentStatus: 'PENDING',
      isTerminal: false,
    });

    const state = buildInitialInvoiceState(invoice);

    expect(state.phase).toBe('selecting');
  });

  it('moves to awaitingDeposit with optimistic quote instructions', () => {
    const initial = buildInitialInvoiceState(createInvoice());

    const next = invoiceReducer(initial, {
      type: 'QUOTE_SUCCEEDED',
      quote: {
        amountIn: '42',
        amountOut: '0.01',
        payToken: 'USDC',
        payNetwork: 'Ethereum',
        depositAddress: '0xdeposit',
        depositMemo: 'memo',
        timeEstimate: '2m',
        expiresAt: '2026-02-20T12:00:00.000Z',
      },
    });

    expect(next.phase).toBe('awaitingDeposit');
    expect(next.optimisticInstructions?.depositAddress).toBe('0xdeposit');
    expect(next.lastKnownAmountIn).toBe('42');
  });

  it('moves to processing when synced invoice status is PROCESSING', () => {
    const initial = buildInitialInvoiceState(createInvoice());

    const next = invoiceReducer(initial, {
      type: 'INVOICE_SYNCED',
      invoice: createInvoice({
        status: 'PROCESSING',
        currentStatus: 'PROCESSING',
        isTerminal: false,
        depositAddress: '0xdeposit',
      }),
    });

    expect(next.phase).toBe('processing');
  });

  it('moves to terminal EXPIRED when countdown expires', () => {
    const initial = buildInitialInvoiceState(createInvoice());

    const next = invoiceReducer(initial, { type: 'COUNTDOWN_EXPIRED' });

    expect(next.phase).toBe('terminal');
    expect(next.terminalOverrideStatus).toBe('EXPIRED');
  });

  it('uses lastKnownAmountIn fallback when API amountIn is null', () => {
    const invoice = createInvoice({ amountIn: null });
    const state = {
      ...buildInitialInvoiceState(invoice),
      lastKnownAmountIn: '9.25',
      quotePending: false,
    };

    const view = buildTrackerView(invoice, state);

    expect(view.instructions.amountIn).toBe('9.25');
  });
});

function createInvoice(overrides?: {
  status?: string;
  currentStatus?: string;
  isTerminal?: boolean;
  depositAddress?: string | null;
  amountIn?: string | null;
}): InvoiceNormalizedResponse {
  const status = overrides?.status ?? 'PENDING';
  const currentStatus = overrides?.currentStatus ?? status;
  const isTerminal = overrides?.isTerminal ?? false;
  const depositAddress = overrides?.depositAddress ?? null;

  return {
    id: 'inv_1',
    status,
    invoice: {
      id: 'inv_1',
      amount: '0.01',
      receiveToken: 'BTC',
      receiveNetwork: 'Bitcoin',
      walletAddress: 'bc1qmerchant',
      description: null,
      buyerName: null,
      buyerEmail: null,
      buyerAddress: null,
      createdAt: '2026-02-20T10:00:00.000Z',
      updatedAt: '2026-02-20T10:00:00.000Z',
    },
    paymentInstructions: {
      payToken: 'USDC',
      payNetwork: 'Ethereum',
      depositAddress,
      depositMemo: null,
      amountIn: overrides?.amountIn ?? null,
      expiresAt: null,
      paidAt: null,
    },
    timeline: {
      currentStatus,
      isTerminal,
      createdAt: '2026-02-20T10:00:00.000Z',
      quotedAt: null,
      expiresAt: null,
      paidAt: null,
      completedAt: null,
      failedAt: null,
      refundedAt: null,
      expiredAt: null,
      lastStatusChangeAt: '2026-02-20T10:00:00.000Z',
    },
  };
}
