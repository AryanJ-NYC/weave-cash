'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/_components/ui/button';
import { Label } from '@/_components/ui/label';
import type { QuoteResponse } from './payment-flow';
import { CopyableField } from './copyable-field';

export function ShowDepositStep({ quote, onConfirmSent }: ShowDepositStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Amount to Send
          </span>
          <span className="text-lg font-semibold text-slate-900 dark:text-white">
            {quote.amountIn} {quote.payToken}
          </span>
        </div>
        {quote.timeEstimate && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Estimated Time
            </span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {quote.timeEstimate}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <QRCodeSVG value={quote.depositAddress} size={180} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-slate-900 dark:text-white">Deposit Address</Label>
        <CopyableField value={quote.depositAddress} />
      </div>

      {quote.depositMemo && (
        <div className="flex flex-col gap-2">
          <Label className="text-slate-900 dark:text-white">Memo</Label>
          <CopyableField value={quote.depositMemo} />
        </div>
      )}

      <Button
        onClick={onConfirmSent}
        className="w-full rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 dark:bg-blue-500 dark:shadow-blue-500/25 dark:hover:bg-blue-600"
      >
        I&apos;ve Sent the Payment
      </Button>
    </div>
  );
}

type ShowDepositStepProps = {
  quote: QuoteResponse;
  onConfirmSent: () => void;
};
