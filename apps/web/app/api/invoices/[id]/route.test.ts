import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findUnique, update, getSwapStatus } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  update: vi.fn(),
  getSwapStatus: vi.fn(),
}));

vi.mock('@repo/database', () => ({
  prisma: { invoice: { findUnique, update } },
}));

vi.mock('@/lib/near-intents/status', () => ({ getSwapStatus }));

import { GET } from './route';

describe('GET /api/invoices/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 when invoice does not exist', async () => {
    findUnique.mockResolvedValueOnce(null);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: 'missing-id' }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: 'Invoice not found',
    });
  });

  it('returns normalized payload with top-level id and status shortcuts', async () => {
    const createdAt = new Date('2026-02-18T10:00:00.000Z');
    const updatedAt = new Date('2026-02-18T10:01:00.000Z');
    const invoice = {
      id: 'inv_123',
      status: 'PENDING',
      receiveToken: 'BTC',
      receiveNetwork: 'Bitcoin',
      amount: '0.01',
      walletAddress: 'bc1qmerchant',
      description: 'Invoice for design',
      buyerName: 'Jane',
      buyerEmail: 'jane@example.com',
      buyerAddress: '123 Main St',
      payToken: null,
      payNetwork: null,
      depositAddress: null,
      depositMemo: null,
      expiresAt: null,
      paidAt: null,
      quotedAt: null,
      createdAt,
      updatedAt,
    };
    findUnique.mockResolvedValueOnce(invoice);

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: invoice.id }),
    });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.id).toBe('inv_123');
    expect(json.status).toBe('PENDING');
    expect(json.invoice).toMatchObject({
      id: 'inv_123',
      amount: '0.01',
      receiveToken: 'BTC',
      receiveNetwork: 'Bitcoin',
      walletAddress: 'bc1qmerchant',
      description: 'Invoice for design',
      buyerName: 'Jane',
      buyerEmail: 'jane@example.com',
      buyerAddress: '123 Main St',
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
    expect(json.paymentInstructions).toMatchObject({
      payToken: null,
      payNetwork: null,
      depositAddress: null,
      depositMemo: null,
      amountIn: null,
      expiresAt: null,
      paidAt: null,
    });
    expect(json.timeline).toMatchObject({
      currentStatus: 'PENDING',
      isTerminal: false,
      createdAt: createdAt.toISOString(),
      quotedAt: null,
      expiresAt: null,
      paidAt: null,
      completedAt: null,
      failedAt: null,
      refundedAt: null,
      expiredAt: null,
      lastStatusChangeAt: updatedAt.toISOString(),
    });
  });

  it('updates status to PROCESSING when SDK reports PROCESSING', async () => {
    const invoice = {
      id: 'inv_processing',
      status: 'AWAITING_DEPOSIT',
      receiveToken: 'BTC',
      receiveNetwork: 'Bitcoin',
      amount: '0.01',
      walletAddress: 'bc1qmerchant',
      description: null,
      buyerName: null,
      buyerEmail: null,
      buyerAddress: null,
      payToken: 'USDC',
      payNetwork: 'Ethereum',
      depositAddress: '0xdeposit',
      depositMemo: 'memo',
      expiresAt: null,
      paidAt: null,
      quotedAt: new Date('2026-02-18T10:01:00.000Z'),
      createdAt: new Date('2026-02-18T10:00:00.000Z'),
      updatedAt: new Date('2026-02-18T10:03:00.000Z'),
    };
    findUnique.mockResolvedValueOnce(invoice);
    getSwapStatus.mockResolvedValueOnce({
      status: 'PROCESSING',
      quoteResponse: { quote: { amountInFormatted: '42.0' } },
    });
    update.mockResolvedValueOnce({
      ...invoice,
      status: 'PROCESSING',
      updatedAt: new Date('2026-02-18T10:04:00.000Z'),
    });

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: invoice.id }),
    });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith({
      data: { status: 'PROCESSING' },
      where: { id: invoice.id },
    });
    expect(json.status).toBe('PROCESSING');
    expect(json.timeline.currentStatus).toBe('PROCESSING');
    expect(json.timeline.quotedAt).toBe(
      new Date('2026-02-18T10:01:00.000Z').toISOString()
    );
    expect(json.paymentInstructions.amountIn).toBe('42.0');
  });

  it('sets paidAt when SDK reports SUCCESS', async () => {
    const invoice = {
      id: 'inv_success',
      status: 'PROCESSING',
      receiveToken: 'BTC',
      receiveNetwork: 'Bitcoin',
      amount: '0.01',
      walletAddress: 'bc1qmerchant',
      description: null,
      buyerName: null,
      buyerEmail: null,
      buyerAddress: null,
      payToken: 'USDC',
      payNetwork: 'Ethereum',
      depositAddress: '0xdeposit',
      depositMemo: null,
      expiresAt: null,
      paidAt: null,
      quotedAt: new Date('2026-02-18T10:01:00.000Z'),
      createdAt: new Date('2026-02-18T10:00:00.000Z'),
      updatedAt: new Date('2026-02-18T10:01:00.000Z'),
    };
    findUnique.mockResolvedValueOnce(invoice);
    getSwapStatus.mockResolvedValueOnce({
      status: 'SUCCESS',
      quoteResponse: { quote: { amountInFormatted: '42.0' } },
    });
    update.mockImplementationOnce(
      async ({ data }: { data: { paidAt: Date } }) => ({
        ...invoice,
        status: 'COMPLETED',
        paidAt: data.paidAt,
        updatedAt: new Date('2026-02-18T10:02:00.000Z'),
      })
    );

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: invoice.id }),
    });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledOnce();
    expect(update.mock.calls[0]?.[0]).toMatchObject({
      where: { id: invoice.id },
      data: {
        status: 'COMPLETED',
      },
    });
    expect(update.mock.calls[0]?.[0].data.paidAt).toBeInstanceOf(Date);
    expect(json.status).toBe('COMPLETED');
    expect(json.paymentInstructions.paidAt).toBeTypeOf('string');
    expect(json.paymentInstructions.amountIn).toBe('42.0');
    expect(json.timeline.completedAt).toBeTypeOf('string');
  });

  it('returns stored invoice when SDK status call throws', async () => {
    const invoice = {
      id: 'inv_error',
      status: 'AWAITING_DEPOSIT',
      receiveToken: 'BTC',
      receiveNetwork: 'Bitcoin',
      amount: '0.01',
      walletAddress: 'bc1qmerchant',
      description: null,
      buyerName: null,
      buyerEmail: null,
      buyerAddress: null,
      payToken: 'USDC',
      payNetwork: 'Ethereum',
      depositAddress: '0xdeposit',
      depositMemo: null,
      expiresAt: null,
      paidAt: null,
      quotedAt: new Date('2026-02-18T10:01:00.000Z'),
      createdAt: new Date('2026-02-18T10:00:00.000Z'),
      updatedAt: new Date('2026-02-18T10:01:00.000Z'),
    };
    findUnique.mockResolvedValueOnce(invoice);
    getSwapStatus.mockRejectedValueOnce(new Error('sdk down'));

    const response = await GET(new Request('http://localhost'), {
      params: Promise.resolve({ id: invoice.id }),
    });
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(update).not.toHaveBeenCalled();
    expect(json.status).toBe('AWAITING_DEPOSIT');
    expect(json.timeline.currentStatus).toBe('AWAITING_DEPOSIT');
  });
});
