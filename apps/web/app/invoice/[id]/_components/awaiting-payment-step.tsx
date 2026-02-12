'use client';

import { useState, useEffect } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import type { QuoteResponse } from './payment-flow';
import { CopyableField } from './copyable-field';

export function AwaitingPaymentStep({
  invoiceId,
  depositAddress,
  depositMemo,
  quote,
  onTerminal,
}: AwaitingPaymentStepProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AwaitingPaymentContent
        invoiceId={invoiceId}
        depositAddress={depositAddress}
        depositMemo={depositMemo}
        quote={quote}
        onTerminal={onTerminal}
      />
    </QueryClientProvider>
  );
}

function AwaitingPaymentContent({
  invoiceId,
  depositAddress,
  depositMemo,
  quote,
  onTerminal,
}: AwaitingPaymentStepProps) {
  const { data } = useQuery({
    queryKey: ['invoice-status', invoiceId],
    queryFn: async () => {
      const res = await fetch(`/api/invoices/${invoiceId}/status`);
      if (!res.ok) throw new Error('Failed to fetch status');
      return res.json() as Promise<StatusResponse>;
    },
    refetchInterval: (query) =>
      query.state.data && TERMINAL_STATUSES.has(query.state.data.status)
        ? false
        : POLL_INTERVAL_MS,
  });

  const currentStatus = data?.status ?? 'AWAITING_DEPOSIT';
  const payInfo =
    data?.amountIn && data?.payToken
      ? { amountIn: data.amountIn, payToken: data.payToken }
      : quote;

  useEffect(() => {
    if (data && TERMINAL_STATUSES.has(data.status)) {
      onTerminal();
    }
  }, [data, onTerminal]);

  const statusText =
    currentStatus === 'PROCESSING'
      ? 'Processing swap...'
      : 'Waiting for deposit...';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 animate-pulse rounded-full bg-blue-500" />
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {statusText}
          </span>
        </div>
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          This page will update automatically when your payment is detected.
        </p>
      </div>

      {payInfo && (
        <div className="flex flex-col gap-2">
          <Label className="text-slate-900 dark:text-white">
            Amount to Send
          </Label>
          <CopyableField value={payInfo.amountIn} label={payInfo.payToken} />
        </div>
      )}

      {depositAddress && (
        <div className="flex flex-col gap-2">
          <Label className="text-slate-900 dark:text-white">
            Deposit Address
          </Label>
          <CopyableField value={depositAddress} />
        </div>
      )}

      {depositMemo && (
        <div className="flex flex-col gap-2">
          <Label className="text-slate-900 dark:text-white">Memo</Label>
          <CopyableField value={depositMemo} />
        </div>
      )}
    </div>
  );
}

const POLL_INTERVAL_MS = 10_000;

const TERMINAL_STATUSES = new Set([
  'COMPLETED',
  'FAILED',
  'REFUNDED',
  'EXPIRED',
]);

type AwaitingPaymentStepProps = {
  invoiceId: string;
  depositAddress: string | null;
  depositMemo: string | null;
  quote: QuoteResponse | null;
  onTerminal: () => void;
};

type StatusResponse = {
  status: string;
  amountIn?: string;
  payToken?: string;
};
