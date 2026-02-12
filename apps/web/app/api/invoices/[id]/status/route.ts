import { NextResponse } from 'next/server';
import { ApiError } from '@defuse-protocol/one-click-sdk-typescript';
import { prisma } from '@repo/database';
import {
  getSwapStatus,
  type GetExecutionStatusResponse,
} from '@/lib/near-intents';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  let currentStatus = invoice.status;
  let paidAt = invoice.paidAt;
  let amountIn: string | null = null;

  if (
    (currentStatus === 'AWAITING_DEPOSIT' || currentStatus === 'PROCESSING') &&
    invoice.depositAddress
  ) {
    try {
      const sdkStatus = await getSwapStatus(
        invoice.depositAddress,
        invoice.depositMemo || undefined
      );

      amountIn =
        sdkStatus.quoteResponse.quote.amountInFormatted ?? null;

      const mappedStatus = mapSdkStatusToAppStatus(sdkStatus);
      if (mappedStatus && mappedStatus !== currentStatus) {
        const updateData: UpdateData =
          mappedStatus === 'COMPLETED'
            ? { status: mappedStatus, paidAt: new Date() }
            : { status: mappedStatus };

        await prisma.invoice.update({
          where: { id },
          data: updateData,
        });

        currentStatus = mappedStatus;
        if (mappedStatus === 'COMPLETED') {
          paidAt = updateData.paidAt ?? null;
        }
      }
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(
          `Failed to get swap status for invoice ${id}:`,
          error.message
        );
      } else {
        throw error;
      }
    }
  }

  return NextResponse.json({
    status: currentStatus,
    depositAddress: invoice.depositAddress,
    depositMemo: invoice.depositMemo,
    paidAt: paidAt?.toISOString() ?? null,
    expiresAt: invoice.expiresAt?.toISOString() ?? null,
    payToken: invoice.payToken ?? null,
    amountIn,
  });
}

// --- Helpers ---

function mapSdkStatusToAppStatus(
  sdkStatus: GetExecutionStatusResponse
): AppStatus | null {
  switch (sdkStatus.status) {
    case 'PENDING_DEPOSIT':
    case 'KNOWN_DEPOSIT_TX':
    case 'INCOMPLETE_DEPOSIT':
      return 'AWAITING_DEPOSIT';
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

// --- Types ---

type AppStatus =
  | 'AWAITING_DEPOSIT'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'REFUNDED'
  | 'FAILED';

type UpdateData = {
  status: AppStatus;
  paidAt?: Date;
};
