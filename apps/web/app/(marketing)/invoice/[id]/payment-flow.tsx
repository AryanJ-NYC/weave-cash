'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TOKENS,
  getNetworksForToken,
  validateWalletAddress,
} from '@/lib/invoice';

export function PaymentFlow(props: PaymentFlowProps) {
  const [step, setStep] = useState<Step>(() => getInitialStep(props));

  if (step === 'TERMINAL') {
    return <TerminalStep status={props.status} paidAt={props.paidAt} />;
  }

  if (step === 'AWAITING_PAYMENT') {
    return (
      <AwaitingPaymentStep
        invoiceId={props.invoiceId}
        depositAddress={props.depositAddress}
        depositMemo={props.depositMemo}
        onTerminal={() => setStep('TERMINAL')}
      />
    );
  }

  if (step === 'SHOW_DEPOSIT') {
    return (
      <ShowDepositStep
        onConfirmSent={() => setStep('AWAITING_PAYMENT')}
      />
    );
  }

  return (
    <SelectCryptoStep
      invoiceId={props.invoiceId}
      onQuoteReceived={() => setStep('SHOW_DEPOSIT')}
    />
  );
}

function SelectCryptoStep({ invoiceId, onQuoteReceived }: SelectCryptoStepProps) {
  const [token, setToken] = useState<Token | ''>('');
  const [network, setNetwork] = useState('');
  const [refundAddress, setRefundAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const networks = token ? getNetworksForToken(token) : [];

  function handleTokenChange(value: string) {
    setToken(value as Token);
    const availableNetworks = getNetworksForToken(value as Token);
    setNetwork(availableNetworks.length === 1 ? availableNetworks[0]! : '');
    setAddressError('');
    setRefundAddress('');
  }

  function handleAddressChange(value: string) {
    setRefundAddress(value);
    if (value && network) {
      const valid = validateWalletAddress(value, network as Network);
      setAddressError(valid ? '' : `Invalid wallet address for ${network}`);
    } else {
      setAddressError('');
    }
  }

  const handleGetQuote = useCallback(async () => {
    if (!token || !network || !refundAddress) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/invoices/${invoiceId}/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payToken: token,
          payNetwork: network,
          refundAddress,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Failed to get quote. Please try again.');
        return;
      }

      const quote = await res.json();
      quoteStore = { ...quote, payToken: token };
      onQuoteReceived();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [token, network, refundAddress, invoiceId, onQuoteReceived]);

  const isValid =
    token !== '' &&
    network !== '' &&
    refundAddress !== '' &&
    addressError === '';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="payToken" className="text-slate-900 dark:text-white">
          Pay with Token
        </Label>
        <Select value={token} onValueChange={handleTokenChange}>
          <SelectTrigger
            id="payToken"
            className="w-full rounded-lg border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
          >
            <SelectValue placeholder="Select token" />
          </SelectTrigger>
          <SelectContent className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {TOKENS.map((t) => (
              <SelectItem
                key={t}
                value={t}
                className="focus:bg-slate-100 dark:focus:bg-slate-800"
              >
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="payNetwork" className="text-slate-900 dark:text-white">
          Network
        </Label>
        {networks.length === 1 ? (
          <Input
            id="payNetwork"
            value={network}
            disabled
            className="rounded-lg border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
          />
        ) : (
          <Select value={network} onValueChange={setNetwork} disabled={!token}>
            <SelectTrigger
              id="payNetwork"
              className="w-full rounded-lg border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
            >
              <SelectValue
                placeholder={token ? 'Select network' : 'Select a token first'}
              />
            </SelectTrigger>
            <SelectContent className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              {networks.map((n) => (
                <SelectItem
                  key={n}
                  value={n}
                  className="focus:bg-slate-100 dark:focus:bg-slate-800"
                >
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="refundAddress" className="text-slate-900 dark:text-white">
          {network ? `Your ${network} Refund Address` : 'Your Refund Address'}
        </Label>
        <Input
          id="refundAddress"
          placeholder={
            network
              ? `Enter your ${network} address for refunds`
              : 'Enter your wallet address for refunds'
          }
          value={refundAddress}
          onChange={(e) => handleAddressChange(e.target.value)}
          className="rounded-lg border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
        />
        {addressError && <p className="text-sm text-red-500">{addressError}</p>}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button
        onClick={handleGetQuote}
        disabled={!isValid || submitting}
        className="w-full rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 dark:bg-blue-500 dark:shadow-blue-500/25 dark:hover:bg-blue-600"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Getting Quote...
          </>
        ) : (
          'Get Quote'
        )}
      </Button>
    </div>
  );
}

function ShowDepositStep({ onConfirmSent }: ShowDepositStepProps) {
  const [quote, setQuote] = useState<QuoteResponse | null>(quoteStore);

  useEffect(() => {
    if (!quote && quoteStore) {
      setQuote(quoteStore);
    }
  }, [quote]);

  if (!quote) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

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

function AwaitingPaymentStep({
  invoiceId,
  depositAddress,
  depositMemo,
  onTerminal,
}: AwaitingPaymentStepProps) {
  const [currentStatus, setCurrentStatus] = useState('AWAITING_DEPOSIT');
  const [payInfo, setPayInfo] = useState<{
    amountIn: string;
    payToken: string;
  } | null>(quoteStore);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    async function poll() {
      while (!cancelledRef.current) {
        try {
          const res = await fetch(`/api/invoices/${invoiceId}/status`);
          if (!res.ok) break;

          const data = await res.json();
          if (cancelledRef.current) break;

          setCurrentStatus(data.status);

          if (data.amountIn && data.payToken) {
            setPayInfo({ amountIn: data.amountIn, payToken: data.payToken });
          }

          if (TERMINAL_STATUSES.has(data.status)) {
            onTerminal();
            break;
          }
        } catch {
          // Ignore network errors and retry
        }

        await sleep(POLL_INTERVAL_MS);
      }
    }

    poll();

    return () => {
      cancelledRef.current = true;
    };
  }, [invoiceId, onTerminal]);

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
          <Label className="text-slate-900 dark:text-white">Amount to Send</Label>
          <CopyableField value={payInfo.amountIn} label={payInfo.payToken} />
        </div>
      )}

      {depositAddress && (
        <div className="flex flex-col gap-2">
          <Label className="text-slate-900 dark:text-white">Deposit Address</Label>
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

function TerminalStep({ status, paidAt }: TerminalStepProps) {
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

function CopyableField({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        readOnly
        onClick={handleCopy}
        className="cursor-pointer rounded-lg border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
      />
      {label && (
        <span className="shrink-0 text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </span>
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={handleCopy}
        className="shrink-0 border-slate-300 dark:border-slate-700"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

function getInitialStep(props: PaymentFlowProps): Step {
  const terminalStatuses = ['COMPLETED', 'FAILED', 'REFUNDED', 'EXPIRED'];
  if (terminalStatuses.includes(props.status)) return 'TERMINAL';
  if (props.depositAddress) return 'AWAITING_PAYMENT';
  return 'SELECT_CRYPTO';
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Module-level store so ShowDepositStep can read the quote set by SelectCryptoStep
// without prop drilling through the parent. This works because both steps live in
// the same client module and only one is mounted at a time.
let quoteStore: QuoteResponse | null = null;

const POLL_INTERVAL_MS = 10_000;

const TERMINAL_STATUSES = new Set(['COMPLETED', 'FAILED', 'REFUNDED', 'EXPIRED']);

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

type Step = 'SELECT_CRYPTO' | 'SHOW_DEPOSIT' | 'AWAITING_PAYMENT' | 'TERMINAL';

type PaymentFlowProps = {
  invoiceId: string;
  status: string;
  amount: string;
  receiveToken: string;
  receiveNetwork: string;
  depositAddress: string | null;
  depositMemo: string | null;
  expiresAt: string | null;
  paidAt: string | null;
};

type QuoteResponse = {
  amountIn: string;
  payToken: string;
  depositAddress: string;
  depositMemo?: string;
  timeEstimate?: string;
};

type Token = (typeof TOKENS)[number];

type Network = 'Bitcoin' | 'Ethereum' | 'Solana';

type SelectCryptoStepProps = {
  invoiceId: string;
  onQuoteReceived: () => void;
};

type ShowDepositStepProps = {
  onConfirmSent: () => void;
};

type AwaitingPaymentStepProps = {
  invoiceId: string;
  depositAddress: string | null;
  depositMemo: string | null;
  onTerminal: () => void;
};

type TerminalStepProps = {
  status: string;
  paidAt: string | null;
};
