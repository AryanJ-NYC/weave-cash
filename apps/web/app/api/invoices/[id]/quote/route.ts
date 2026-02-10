import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ApiError } from '@defuse-protocol/one-click-sdk-typescript';
import { prisma } from '@repo/database';
import { getSwapQuote } from '@/lib/near-intents';
import {
  TOKENS,
  TOKEN_NETWORK_MAP,
  validateWalletAddress,
} from '@/lib/invoice';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const result = await quoteRequestSchema.safeParseAsync(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { payToken, payNetwork, refundAddress } = result.data;

  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  if (invoice.status !== 'PENDING') {
    return NextResponse.json(
      { error: 'Invoice is not in PENDING status' },
      { status: 409 }
    );
  }

  let quoteResponse;
  try {
    quoteResponse = await getSwapQuote({
      payToken,
      payNetwork: payNetwork as Network,
      receiveToken: invoice.receiveToken as typeof payToken,
      receiveNetwork: invoice.receiveNetwork as Network,
      amount: invoice.amount,
      recipientAddress: invoice.walletAddress,
      refundAddress,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: 'Failed to get swap quote' },
        { status: 502 }
      );
    }
    throw error;
  }

  const { quote } = quoteResponse;

  const updateResult = await prisma.invoice.updateMany({
    where: { id, status: 'PENDING' },
    data: {
      payToken,
      payNetwork,
      depositAddress: quote.depositAddress,
      depositMemo: quote.depositMemo,
      status: 'AWAITING_DEPOSIT',
      expiresAt: quote.deadline,
    },
  });

  if (updateResult.count === 0) {
    return NextResponse.json(
      { error: 'Invoice status changed, please try again' },
      { status: 409 }
    );
  }

  return NextResponse.json({
    depositAddress: quote.depositAddress,
    depositMemo: quote.depositMemo,
    amountIn: quote.amountInFormatted,
    amountOut: quote.amountOutFormatted,
    timeEstimate: quote.timeEstimate,
    expiresAt: quote.deadline,
  });
}

// --- Validation ---

const quoteRequestSchema = z
  .object({
    payToken: z.enum(TOKENS),
    payNetwork: z.string(),
    refundAddress: z.string().min(1, 'Refund address is required'),
  })
  .superRefine((data, ctx) => {
    const validNetworks: readonly Network[] = TOKEN_NETWORK_MAP[data.payToken];
    if (!validNetworks.includes(data.payNetwork as Network)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${data.payNetwork} is not a valid network for ${data.payToken}`,
        path: ['payNetwork'],
      });
      return;
    }

    if (
      !validateWalletAddress(data.refundAddress, data.payNetwork as Network)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid refund address for ${data.payNetwork}`,
        path: ['refundAddress'],
      });
    }
  });

// --- Types ---

type Network = 'Bitcoin' | 'Ethereum' | 'Solana';
