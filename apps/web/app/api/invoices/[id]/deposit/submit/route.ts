import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  ApiError,
  type SubmitDepositTxResponse,
} from '@defuse-protocol/one-click-sdk-typescript';
import { prisma } from '@repo/database';
import { submitSwapDepositTx } from '@/lib/near-intents/status';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    console.error(`Invalid JSON body for invoice ${id} deposit submit`);
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const result = submitDepositTxSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  if (!isSubmittableStatus(invoice.status)) {
    return NextResponse.json(
      { error: 'Invoice is not accepting deposit submissions' },
      { status: 409 }
    );
  }

  if (!invoice.depositAddress) {
    return NextResponse.json(
      { error: 'Invoice is missing deposit instructions' },
      { status: 409 }
    );
  }

  let submitResponse: SubmitDepositTxResponse;
  try {
    submitResponse = await submitSwapDepositTx({
      txHash: result.data.txHash,
      depositAddress: invoice.depositAddress,
      memo: invoice.depositMemo ?? undefined,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(
        `Failed to submit deposit transaction hash for invoice ${id}:`,
        error.body ?? error.message
      );
      return NextResponse.json(
        {
          error:
            error.body?.message ?? 'Failed to submit deposit transaction hash',
        },
        { status: 502 }
      );
    }
    console.error(
      `Unexpected error submitting deposit transaction hash for invoice ${id}:`,
      error
    );
    throw error;
  }

  const mappedStatus = mapSdkStatusToAppStatus(submitResponse.status);
  const nextStatus = mappedStatus ?? invoice.status;

  if (mappedStatus && mappedStatus !== invoice.status) {
    const data: UpdateData =
      mappedStatus === 'COMPLETED'
        ? { status: mappedStatus, paidAt: new Date() }
        : { status: mappedStatus };

    await prisma.invoice.update({
      where: { id },
      data,
    });
  }

  return NextResponse.json({
    status: nextStatus,
    message: getSubmitStatusMessage(nextStatus),
  });
}

function mapSdkStatusToAppStatus(
  status: SubmitDepositTxResponse['status']
): AppStatus | null {
  switch (status) {
    case 'PENDING_DEPOSIT':
    case 'INCOMPLETE_DEPOSIT':
      return 'AWAITING_DEPOSIT';
    case 'KNOWN_DEPOSIT_TX':
    case 'PROCESSING':
      return 'PROCESSING';
    case 'SUCCESS':
      return 'COMPLETED';
    case 'REFUNDED':
      return 'REFUNDED';
    case 'FAILED':
      return 'FAILED';
    default:
      return null;
  }
}

function isSubmittableStatus(status: string): status is SubmittableStatus {
  return status === 'AWAITING_DEPOSIT' || status === 'PROCESSING';
}

function getSubmitStatusMessage(status: AppStatus): string {
  switch (status) {
    case 'AWAITING_DEPOSIT':
      return 'Deposit transaction submitted. Waiting for confirmation.';
    case 'PROCESSING':
      return 'Deposit received. Processing payment.';
    case 'COMPLETED':
      return 'Payment completed.';
    case 'REFUNDED':
      return 'Payment refunded.';
    case 'FAILED':
      return 'Payment failed.';
  }
}

const submitDepositTxSchema = z.object({
  txHash: z.string().trim().min(1, 'Transaction hash is required'),
});

type AppStatus =
  | 'AWAITING_DEPOSIT'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'REFUNDED'
  | 'FAILED';

type SubmittableStatus = 'AWAITING_DEPOSIT' | 'PROCESSING';

type UpdateData = {
  status: AppStatus;
  paidAt?: Date;
};
