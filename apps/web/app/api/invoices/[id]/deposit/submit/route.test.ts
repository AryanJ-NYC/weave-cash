import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@defuse-protocol/one-click-sdk-typescript';

const { findUnique, update, submitSwapDepositTx } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  update: vi.fn(),
  submitSwapDepositTx: vi.fn(),
}));

vi.mock('@repo/database', () => ({
  prisma: { invoice: { findUnique, update } },
}));

vi.mock('@/lib/near-intents/status', () => ({ submitSwapDepositTx }));

import { POST } from './route';

describe('POST /api/invoices/[id]/deposit/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when request body is invalid JSON', async () => {
    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: '{',
      }),
      { params: Promise.resolve({ id: 'inv_1' }) }
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Invalid JSON body',
    });
  });

  it('returns 400 when txHash is missing', async () => {
    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({}),
      }),
      { params: Promise.resolve({ id: 'inv_1' }) }
    );
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error.txHash).toBeDefined();
  });

  it('returns 404 when invoice is missing', async () => {
    findUnique.mockResolvedValueOnce(null);

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ txHash: '0xabc' }),
      }),
      { params: Promise.resolve({ id: 'missing' }) }
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: 'Invoice not found',
    });
  });

  it('returns 409 when invoice status is not submittable', async () => {
    findUnique.mockResolvedValueOnce(createInvoice({ status: 'PENDING' }));

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ txHash: '0xabc' }),
      }),
      { params: Promise.resolve({ id: 'inv_1' }) }
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: 'Invoice is not accepting deposit submissions',
    });
  });

  it('returns 409 when invoice has no deposit address', async () => {
    findUnique.mockResolvedValueOnce(
      createInvoice({ status: 'AWAITING_DEPOSIT', depositAddress: null })
    );

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ txHash: '0xabc' }),
      }),
      { params: Promise.resolve({ id: 'inv_1' }) }
    );

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      error: 'Invoice is missing deposit instructions',
    });
  });

  it('submits tx hash and updates invoice to PROCESSING for KNOWN_DEPOSIT_TX', async () => {
    findUnique.mockResolvedValueOnce(
      createInvoice({
        status: 'AWAITING_DEPOSIT',
        depositAddress: '0xdeposit',
        depositMemo: 'memo_123',
      })
    );
    submitSwapDepositTx.mockResolvedValueOnce({
      status: 'KNOWN_DEPOSIT_TX',
    });

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ txHash: ' 0xabc ' }),
      }),
      { params: Promise.resolve({ id: 'inv_1' }) }
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(submitSwapDepositTx).toHaveBeenCalledWith({
      txHash: '0xabc',
      depositAddress: '0xdeposit',
      memo: 'memo_123',
    });
    expect(update).toHaveBeenCalledWith({
      where: { id: 'inv_1' },
      data: { status: 'PROCESSING' },
    });
    expect(json).toEqual({
      status: 'PROCESSING',
      message: 'Deposit received. Processing payment.',
    });
  });

  it('sets paidAt when submit response reports SUCCESS', async () => {
    findUnique.mockResolvedValueOnce(
      createInvoice({
        status: 'PROCESSING',
        depositAddress: '0xdeposit',
      })
    );
    submitSwapDepositTx.mockResolvedValueOnce({
      status: 'SUCCESS',
    });

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ txHash: '0xabc' }),
      }),
      { params: Promise.resolve({ id: 'inv_1' }) }
    );
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledOnce();
    expect(update.mock.calls[0]?.[0]).toMatchObject({
      where: { id: 'inv_1' },
      data: { status: 'COMPLETED' },
    });
    expect(update.mock.calls[0]?.[0].data.paidAt).toBeInstanceOf(Date);
    expect(json).toEqual({
      status: 'COMPLETED',
      message: 'Payment completed.',
    });
  });

  it('returns 502 when 1Click submit fails with ApiError', async () => {
    findUnique.mockResolvedValueOnce(
      createInvoice({
        status: 'AWAITING_DEPOSIT',
        depositAddress: '0xdeposit',
      })
    );
    submitSwapDepositTx.mockRejectedValueOnce(createApiError('Upstream failed'));

    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ txHash: '0xabc' }),
      }),
      { params: Promise.resolve({ id: 'inv_1' }) }
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: 'Upstream failed',
    });
    expect(update).not.toHaveBeenCalled();
  });
});

function createInvoice(overrides?: {
  status?: string;
  depositAddress?: string | null;
  depositMemo?: string | null;
}) {
  return {
    id: 'inv_1',
    status: overrides?.status ?? 'AWAITING_DEPOSIT',
    depositAddress:
      overrides && 'depositAddress' in overrides
        ? overrides.depositAddress
        : '0xdeposit',
    depositMemo:
      overrides && 'depositMemo' in overrides ? overrides.depositMemo : null,
  };
}

function createApiError(message: string) {
  const error = new Error(message);
  Object.setPrototypeOf(error, ApiError.prototype);

  const apiError = error as ApiError;
  Object.defineProperty(apiError, 'body', {
    value: { message },
    configurable: true,
    enumerable: true,
  });

  return apiError;
}
