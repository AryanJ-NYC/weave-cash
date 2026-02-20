'use client';

import { useEffect, useRef, useState } from 'react';
import { intervalToDuration } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import type { TrackerInstructions } from '@/lib/invoice/payment';

export function DepositStep({
  instructions,
  status,
  onCountdownExpired,
}: DepositStepProps) {
  const { formatted, isExpired } = useCountdown(instructions.expiresAt);
  const hasHandledExpiryRef = useRef(false);

  useEffect(() => {
    if (isExpired && !hasHandledExpiryRef.current) {
      hasHandledExpiryRef.current = true;
      onCountdownExpired();
    }
  }, [isExpired, onCountdownExpired]);

  const address = instructions.depositAddress;
  const memo = instructions.depositMemo;
  const payInfo =
    instructions.amountIn && instructions.payToken
      ? { amountIn: instructions.amountIn, payToken: instructions.payToken }
      : null;

  const statusText =
    status === 'PROCESSING' ? 'Processing swap...' : 'Waiting for deposit...';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Current phase
        </span>
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {statusText}
        </span>
      </div>

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
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <QRCodeSVG value={address} size={180} />
          </div>
        </div>
      )}

      {formatted && (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Quote expires in{' '}
          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
            {formatted}
          </span>
        </p>
      )}

      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        This page updates automatically while payment progresses.
      </p>
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

type DepositStepProps = {
  instructions: TrackerInstructions;
  status: string;
  onCountdownExpired: () => void;
};

type InfoRowProps = {
  label: string;
  children: React.ReactNode;
};

type CopyOnClickProps = {
  value: string;
  children: React.ReactNode;
};
