'use client';

import { useState, useEffect, useRef } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { intervalToDuration } from 'date-fns';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { isTerminalStatus, type TerminalInfo } from '@/lib/invoice/status';
import {
  isDepositDetectedSdk,
  type InvoiceStatusResponse,
} from '@/lib/invoice/payment';

export function DepositStep(props: DepositStepProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <DepositContent {...props} />
    </QueryClientProvider>
  );
}

function DepositContent({
  initialData,
  onTerminal,
  onStatusChange,
}: DepositStepProps) {
  const { data, isDetected, countdown } = useInvoiceStatus({
    initialData,
    onStatusChange,
    onTerminal,
  });

  if (isDetected) {
    return <DetectedView />;
  }

  const address = data.depositAddress;
  const memo = data.depositMemo;
  const payInfo =
    data.amountIn && data.payToken
      ? { amountIn: data.amountIn, payToken: data.payToken }
      : null;

  const statusText =
    data.status === 'PROCESSING'
      ? 'Processing swap...'
      : 'Waiting for deposit...';

  return (
    <div className="flex flex-col gap-3">
      {payInfo && (
        <CopyOnClick value={payInfo.amountIn}>
          <InfoRow label="Amount to Send">
            <span className="truncate text-sm font-medium">
              {payInfo.amountIn} {payInfo.payToken}
            </span>
          </InfoRow>
        </CopyOnClick>
      )}

      {address && (
        <CopyOnClick value={address}>
          <InfoRow label="Deposit Address">
            <span className="truncate text-sm font-medium">{address}</span>
          </InfoRow>
        </CopyOnClick>
      )}

      {memo && (
        <CopyOnClick value={memo}>
          <InfoRow label="Memo">
            <span className="truncate text-sm font-medium">{memo}</span>
          </InfoRow>
        </CopyOnClick>
      )}

      {address && (
        <div className="flex justify-center py-2">
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
        {countdown && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Quote expires in{' '}
            <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
              {countdown}
            </span>
          </p>
        )}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          This page will update automatically when your payment is detected.
        </p>
      </div>
    </div>
  );
}

function DetectedView() {
  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <svg
          className="h-8 w-8 text-green-600 dark:text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Payment Detected
        </h3>
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Your payment has been detected and is being processed. You&apos;re all
          set!
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Finalizing in the background...
        </span>
      </div>
    </div>
  );
}

function InfoRow({ label, children }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
      <span className="shrink-0 text-sm text-slate-500 dark:text-slate-400">
        {label}
      </span>
      {children}
    </div>
  );
}

function CopyOnClick({ value, children }: CopyOnClickProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="relative cursor-pointer text-left"
    >
      {children}
      {copied && (
        <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-900/80 text-sm font-medium text-white">
          Copied!
        </span>
      )}
    </button>
  );
}

function useInvoiceStatus({
  initialData,
  onStatusChange,
  onTerminal,
}: UseInvoiceStatusParams) {
  const { id: invoiceId } = useParams<{ id: string }>();
  const isExpiredRef = useRef(false);

  const { data } = useQuery({
    queryKey: ['invoice-status', invoiceId],
    queryFn: async (): Promise<InvoiceStatusResponse> => {
      const res = await fetch(`/api/invoices/${invoiceId}/status`);
      if (!res.ok) throw new Error('Failed to fetch status');
      return res.json();
    },
    initialData,
    refetchInterval: (query) => {
      if (query.state.data && isTerminalStatus(query.state.data.status))
        return false;
      if (isExpiredRef.current) return false;
      return POLL_INTERVAL_MS;
    },
  });

  useEffect(() => {
    if (data) {
      onStatusChange(data.status, data.sdkStatus);
    }
  }, [data, onStatusChange]);

  useEffect(() => {
    if (data && isTerminalStatus(data.status)) {
      onTerminal({ status: data.status, paidAt: data.paidAt ?? null });
    }
  }, [data, onTerminal]);

  const { formatted, isExpired } = useCountdown(data?.expiresAt ?? null);
  isExpiredRef.current = isExpired;

  useEffect(() => {
    if (isExpired) onTerminal({ status: 'EXPIRED', paidAt: null });
  }, [isExpired, onTerminal]);

  return {
    countdown: formatted,
    data,
    isDetected: isDepositDetectedSdk(data?.sdkStatus),
  };
}

function useCountdown(expiresAt: string | null) {
  const [remaining, setRemaining] = useState<number | null>(() =>
    getSecondsUntil(expiresAt)
  );

  useEffect(() => {
    const secs = getSecondsUntil(expiresAt);
    if (secs === null) {
      setRemaining(null);
      return;
    }

    setRemaining(secs);
    const id = setInterval(() => {
      const s = getSecondsUntil(expiresAt);
      setRemaining(s ?? 0);
      if (s === null || s <= 0) clearInterval(id);
    }, 1_000);

    return () => clearInterval(id);
  }, [expiresAt]);

  return {
    formatted: remaining !== null ? formatCountdown(remaining) : null,
    isExpired: remaining !== null && remaining <= 0,
  };
}

function getSecondsUntil(isoDate: string | null): number | null {
  if (!isoDate) return null;
  const secs = Math.floor((new Date(isoDate).getTime() - Date.now()) / 1000);
  return secs > 0 ? secs : null;
}

function formatCountdown(totalSeconds: number): string {
  const duration = intervalToDuration({ start: 0, end: totalSeconds * 1000 });
  const parts: string[] = [];
  if (duration.hours) parts.push(`${duration.hours}h`);
  if (duration.minutes) parts.push(`${duration.minutes}m`);
  parts.push(`${duration.seconds ?? 0}s`);
  return parts.join(' ');
}

const POLL_INTERVAL_MS = 10_000;

type DepositStepProps = {
  initialData: InvoiceStatusResponse;
  onTerminal: (info: TerminalInfo) => void;
  onStatusChange: (appStatus: string, sdkStatus: string | null) => void;
};

type UseInvoiceStatusParams = {
  initialData: InvoiceStatusResponse;
  onStatusChange: (appStatus: string, sdkStatus: string | null) => void;
  onTerminal: (info: TerminalInfo) => void;
};

type InfoRowProps = {
  label: string;
  children: React.ReactNode;
};

type CopyOnClickProps = {
  value: string;
  children: React.ReactNode;
};
