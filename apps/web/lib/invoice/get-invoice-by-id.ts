import { ApiError } from '@defuse-protocol/one-click-sdk-typescript';
import { prisma, type Invoice } from '@repo/database';
import {
  getSwapStatus,
  type GetExecutionStatusResponse,
} from '@/lib/near-intents/status';
import {
  type InvoiceNormalizedResponse,
  type InvoiceTimeline,
  type PaymentInstructions,
} from './payment';
import { isTerminalStatus } from './status';

export async function getInvoiceById(
  id: string
): Promise<InvoiceNormalizedResponse | null> {
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) {
    return null;
  }

  let currentInvoice = invoice;
  let amountIn: string | null = null;

  if (
    isRefreshableStatus(currentInvoice.status) &&
    currentInvoice.depositAddress
  ) {
    try {
      const sdkResponse = await getSwapStatus(
        currentInvoice.depositAddress,
        currentInvoice.depositMemo || undefined
      );
      amountIn = sdkResponse.quoteResponse.quote.amountInFormatted ?? null;

      const mappedStatus = mapSdkStatusToAppStatus(sdkResponse);

      if (mappedStatus && mappedStatus !== currentInvoice.status) {
        const data: UpdateData =
          mappedStatus === 'COMPLETED'
            ? { status: mappedStatus, paidAt: new Date() }
            : { status: mappedStatus };

        currentInvoice = await prisma.invoice.update({
          data,
          where: { id },
        });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(
          `Failed to refresh invoice ${id} from swap status:`,
          error.message
        );
      } else {
        console.error(`Unexpected swap status error for invoice ${id}`);
      }
    }
  }

  return serializeInvoice(currentInvoice, amountIn);
}

function isRefreshableStatus(status: string): status is RefreshableStatus {
  return status === 'AWAITING_DEPOSIT' || status === 'PROCESSING';
}

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

function serializeInvoice(
  invoice: Invoice,
  amountIn: string | null
): InvoiceNormalizedResponse {
  const createdAt = invoice.createdAt.toISOString();
  const updatedAt = invoice.updatedAt.toISOString();
  const expiresAt = invoice.expiresAt?.toISOString() ?? null;
  const paidAt = invoice.paidAt?.toISOString() ?? null;
  const quotedAt = getQuotedAt(invoice, updatedAt);

  const timeline: InvoiceTimeline = {
    currentStatus: invoice.status,
    isTerminal: isTerminalStatus(invoice.status),
    createdAt,
    quotedAt,
    expiresAt,
    paidAt,
    completedAt: invoice.status === 'COMPLETED' ? paidAt : null,
    failedAt: invoice.status === 'FAILED' ? updatedAt : null,
    refundedAt: invoice.status === 'REFUNDED' ? updatedAt : null,
    expiredAt: invoice.status === 'EXPIRED' ? updatedAt : null,
    lastStatusChangeAt: updatedAt,
  };

  const paymentInstructions: PaymentInstructions = {
    payToken: invoice.payToken,
    payNetwork: invoice.payNetwork,
    depositAddress: invoice.depositAddress,
    depositMemo: invoice.depositMemo,
    amountIn,
    expiresAt,
    paidAt,
  };

  return {
    id: invoice.id,
    status: invoice.status,
    invoice: {
      id: invoice.id,
      amount: invoice.amount,
      receiveToken: invoice.receiveToken,
      receiveNetwork: invoice.receiveNetwork,
      walletAddress: invoice.walletAddress,
      description: invoice.description,
      buyerName: invoice.buyerName,
      buyerEmail: invoice.buyerEmail,
      buyerAddress: invoice.buyerAddress,
      createdAt,
      updatedAt,
    },
    paymentInstructions,
    timeline,
  };
}

function getQuotedAt(invoice: Invoice, updatedAt: string): string | null {
  if (invoice.quotedAt) {
    return invoice.quotedAt.toISOString();
  }

  if (!invoice.depositAddress) {
    return null;
  }

  // Backwards compatibility for rows written before quotedAt was persisted.
  if (invoice.expiresAt) {
    return new Date(
      invoice.expiresAt.getTime() - LEGACY_QUOTE_WINDOW_MS
    ).toISOString();
  }

  return updatedAt;
}

type AppStatus =
  | 'AWAITING_DEPOSIT'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'REFUNDED'
  | 'FAILED';

type RefreshableStatus = 'AWAITING_DEPOSIT' | 'PROCESSING';

type UpdateData = {
  status: AppStatus;
  paidAt?: Date;
};

const LEGACY_QUOTE_WINDOW_MS = 30 * 60 * 1000;
