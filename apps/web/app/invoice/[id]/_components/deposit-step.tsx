'use client';

import { useState, useEffect } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { Label } from '@/_components/ui/label';
import type { QuoteResponse } from './payment-flow';
import { CopyableField } from './copyable-field';

export function DepositStep({
  invoiceId,
  depositAddress,
  depositMemo,
  quote,
  onTerminal,
}: DepositStepProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <DepositContent
        invoiceId={invoiceId}
        depositAddress={depositAddress}
        depositMemo={depositMemo}
        quote={quote}
        onTerminal={onTerminal}
      />
    </QueryClientProvider>
  );
}

function DepositContent({
  invoiceId,
  depositAddress,
  depositMemo,
  quote,
  onTerminal,
}: DepositStepProps) {
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

  useEffect(() => {
    if (data && TERMINAL_STATUSES.has(data.status)) {
      onTerminal({ status: data.status, paidAt: data.paidAt ?? null });
    }
  }, [data, onTerminal]);

  const address = quote?.depositAddress ?? depositAddress;
  const memo = quote?.depositMemo ?? depositMemo;
  const payInfo =
    quote ??
    (data?.amountIn && data?.payToken
      ? { amountIn: data.amountIn, payToken: data.payToken }
      : null);

  const currentStatus = data?.status ?? 'AWAITING_DEPOSIT';
  const statusText =
    currentStatus === 'PROCESSING'
      ? 'Processing swap...'
      : 'Waiting for deposit...';

  return (
    <div className="flex flex-col gap-5">
      {payInfo && (
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Amount to Send
            </span>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">
              {payInfo.amountIn} {payInfo.payToken}
            </span>
          </div>
        </div>
      )}

      {address && (
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <QRCodeSVG value={address} size={180} />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-3 py-2">
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

      {address && (
        <div className="flex flex-col gap-2">
          <Label className="text-slate-900 dark:text-white">
            Deposit Address
          </Label>
          <CopyableField value={address} />
        </div>
      )}

      {memo && (
        <div className="flex flex-col gap-2">
          <Label className="text-slate-900 dark:text-white">Memo</Label>
          <CopyableField value={memo} />
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

type DepositStepProps = {
  invoiceId: string;
  depositAddress: string | null;
  depositMemo: string | null;
  quote: QuoteResponse | null;
  onTerminal: (info: TerminalInfo) => void;
};

export type TerminalInfo = {
  status: string;
  paidAt: string | null;
};

type StatusResponse = {
  status: string;
  amountIn?: string;
  payToken?: string;
  paidAt?: string;
};
