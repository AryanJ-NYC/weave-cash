'use client';

export function InvoiceSummary({
  amount,
  receiveToken,
  receiveNetwork,
  status,
  description,
  buyerName,
  buyerEmail,
  buyerAddress,
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
      {(buyerName || buyerEmail || buyerAddress) && (
        <div className="flex flex-col gap-2 border-t border-slate-200 pt-3 mt-3 dark:border-slate-800">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Buyer Details
          </span>
          {buyerName && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Name
              </span>
              <span className="text-sm text-slate-900 dark:text-white">
                {buyerName}
              </span>
            </div>
          )}
          {buyerEmail && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Email
              </span>
              <span className="text-sm text-slate-900 dark:text-white">
                {buyerEmail}
              </span>
            </div>
          )}
          {buyerAddress && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Billing Address
              </span>
              <span className="text-sm text-right text-slate-900 dark:text-white">
                {buyerAddress}
              </span>
            </div>
          )}
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
  DEPOSIT_DETECTED: {
    label: 'Payment Detected',
    className:
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
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
  buyerName: string | null;
  buyerEmail: string | null;
  buyerAddress: string | null;
};
