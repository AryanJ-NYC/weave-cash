'use client';

import { CheckCircle2, XCircle, RefreshCw, Clock } from 'lucide-react';

export function TerminalStep({ status, paidAt }: TerminalStepProps) {
  const config = TERMINAL_CONFIG[status] ?? DEFAULT_TERMINAL;
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <Icon className={`h-16 w-16 ${config.iconClassName}`} />
      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          {config.title}
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {config.description}
        </p>
      </div>
      {status === 'COMPLETED' && paidAt && (
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Paid on {new Date(paidAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}

const DEFAULT_TERMINAL = {
  icon: XCircle,
  iconClassName: 'text-red-500',
  title: 'Payment Failed',
  description: 'Something went wrong processing your payment.',
};

const TERMINAL_CONFIG: Record<
  string,
  {
    icon: typeof CheckCircle2;
    iconClassName: string;
    title: string;
    description: string;
  }
> = {
  COMPLETED: {
    icon: CheckCircle2,
    iconClassName: 'text-green-500',
    title: 'Payment Complete!',
    description: 'Your payment has been processed successfully.',
  },
  FAILED: {
    icon: XCircle,
    iconClassName: 'text-red-500',
    title: 'Payment Failed',
    description: 'Something went wrong processing your payment.',
  },
  REFUNDED: {
    icon: RefreshCw,
    iconClassName: 'text-gray-500',
    title: 'Payment Refunded',
    description: 'Your payment has been refunded to your wallet.',
  },
  EXPIRED: {
    icon: Clock,
    iconClassName: 'text-orange-500',
    title: 'Invoice Expired',
    description: 'This invoice has expired.',
  },
};

type TerminalStepProps = {
  status: string;
  paidAt: string | null;
};
