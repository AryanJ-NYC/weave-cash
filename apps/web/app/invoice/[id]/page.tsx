import { notFound } from 'next/navigation';
import { prisma } from '@repo/database';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { getSwapStatus } from '@/lib/near-intents/status';
import { CopyLinkButton } from './_components/copy-link-button';
import { PaymentFlow } from './_components/payment-flow';

export default async function InvoicePaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id } });

  if (!invoice) {
    notFound();
  }

  let amountIn: string | null = null;
  if (invoice.depositAddress) {
    try {
      const sdkStatus = await getSwapStatus(
        invoice.depositAddress,
        invoice.depositMemo ?? undefined,
      );
      amountIn = sdkStatus.quoteResponse.quote.amountInFormatted;
    } catch {
      // SDK call failed; amountIn will load on first poll
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 md:py-24">
      <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-900 dark:text-white">
            Pay Invoice
          </CardTitle>
          <CardDescription className="text-pretty text-slate-600 dark:text-slate-400">
            Complete your payment by selecting your preferred cryptocurrency.
          </CardDescription>
          <CardAction>
            <CopyLinkButton />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <InvoiceSummary
            amount={invoice.amount}
            receiveToken={invoice.receiveToken}
            receiveNetwork={invoice.receiveNetwork}
            status={invoice.status}
            description={invoice.description}
          />

          <PaymentFlow
            invoiceId={invoice.id}
            status={invoice.status}
            depositAddress={invoice.depositAddress}
            depositMemo={invoice.depositMemo}
            paidAt={invoice.paidAt?.toISOString() ?? null}
            amountIn={amountIn}
            payToken={invoice.payToken ?? null}
            expiresAt={invoice.expiresAt?.toISOString() ?? null}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function InvoiceSummary({
  amount,
  receiveToken,
  receiveNetwork,
  status,
  description,
}: InvoiceSummaryProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Amount
        </span>
        <span className="text-lg font-semibold text-slate-900 dark:text-white">
          {amount} {receiveToken}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Network
        </span>
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {receiveNetwork}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Status
        </span>
        <StatusBadge status={status} />
      </div>
      {description && (
        <div className="flex flex-col gap-1 border-t border-slate-200 pt-3 mt-3 dark:border-slate-800">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Description
          </span>
          <span className="text-sm text-slate-900 dark:text-white">
            {description}
          </span>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? DEFAULT_STATUS;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

const DEFAULT_STATUS = {
  label: 'Pending',
  className:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'Pending',
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  AWAITING_DEPOSIT: {
    label: 'Awaiting Deposit',
    className:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  PROCESSING: {
    label: 'Processing',
    className:
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  COMPLETED: {
    label: 'Completed',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  FAILED: {
    label: 'Failed',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  EXPIRED: {
    label: 'Expired',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  REFUNDED: {
    label: 'Refunded',
    className:
      'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  },
};

type InvoiceSummaryProps = {
  amount: string;
  receiveToken: string;
  receiveNetwork: string;
  status: string;
  description: string | null;
};
