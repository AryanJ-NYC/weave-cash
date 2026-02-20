'use client';

import { CheckCircle2, CircleDashed } from 'lucide-react';
import { DepositStep } from './deposit-step';
import { InvoiceSummary } from './invoice-summary';
import { SelectCryptoStep } from './select-crypto-step';
import { TerminalStep } from './terminal-step';
import { useInvoice } from '@/lib/invoice/use-invoice';
import {
  type InvoiceNormalizedResponse,
  type TrackerPhase,
} from '@/lib/invoice/payment';

export function PaymentFlow({ invoiceId, initialInvoice }: PaymentFlowProps) {
  const {
    phase,
    status,
    summary,
    timeline,
    instructions,
    quoteError,
    quotePending,
    requestQuote,
    onCountdownExpired,
  } = useInvoice({ invoiceId, initialInvoice });

  const sections = getVisibleSectionsForPhase(phase);

  return (
    <div className="flex flex-col gap-6">
      <InvoiceSummary {...summary} status={status} />

      <TrackerTimeline status={status} timeline={timeline} />

      {sections.showQuote && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Choose how you want to pay
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Pick your token, network, and refund address to generate payment
            instructions.
          </p>
          <div className="mt-5">
            <SelectCryptoStep
              onRequestQuote={requestQuote}
              submitting={quotePending}
              error={quoteError}
            />
          </div>
        </section>
      )}

      {sections.showInstructions && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Payment instructions
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Send payment using the details below. Status updates happen
            automatically.
          </p>
          <div className="mt-5">
            <DepositStep
              instructions={instructions}
              status={status}
              onCountdownExpired={onCountdownExpired}
            />
          </div>
        </section>
      )}

      {sections.showTerminal && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <TerminalStep status={status} paidAt={instructions.paidAt} />
        </section>
      )}
    </div>
  );
}

function TrackerTimeline({
  status,
  timeline,
}: {
  status: string;
  timeline: InvoiceNormalizedResponse['timeline'];
}) {
  const items = [
    {
      id: 'created',
      label: 'Invoice created',
      value: timeline.createdAt,
      active: true,
    },
    {
      id: 'quoted',
      label: 'Quote issued',
      value: timeline.quotedAt,
      active: Boolean(timeline.quotedAt),
    },
    {
      id: 'processing',
      label: 'Payment processing',
      value:
        status === 'PROCESSING' || status === 'COMPLETED'
          ? timeline.lastStatusChangeAt
          : null,
      active: status === 'PROCESSING' || status === 'COMPLETED',
    },
    {
      id: 'terminal',
      label: 'Outcome',
      value: timeline.isTerminal ? formatInvoiceStatus(status) : null,
      active: timeline.isTerminal,
      valueType: 'text' as const,
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
          Payment tracker
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Current: {formatInvoiceStatus(status)}
        </span>
      </div>
      <div className="grid gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/50"
          >
            <div className="flex items-center gap-2">
              {item.active ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <CircleDashed className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              )}
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {item.label}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {item.value
                ? item.valueType === 'text'
                  ? item.value
                  : new Date(item.value).toLocaleString()
                : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatInvoiceStatus(status: string) {
  return status
    .toLowerCase()
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

export function getVisibleSectionsForPhase(phase: TrackerPhase) {
  return {
    showQuote: phase === 'selecting',
    showInstructions: phase === 'awaitingDeposit' || phase === 'processing',
    showTerminal: phase === 'terminal',
  };
}

type PaymentFlowProps = {
  invoiceId: string;
  initialInvoice: InvoiceNormalizedResponse;
};
