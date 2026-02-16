'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_components/ui/select';
import { TOKENS } from '@/lib/invoice/tokens';
import { useTokenNetwork } from '@/lib/invoice/use-token-network';
import type { PaymentQuote } from '@/lib/invoice/payment';

export function SelectCryptoStep({ invoiceId, onQuoteReceived }: SelectCryptoStepProps) {
  const {
    token,
    network,
    networks,
    address: refundAddress,
    addressError,
    handleTokenChange,
    handleNetworkChange,
    handleAddressChange,
  } = useTokenNetwork();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleGetQuote() {
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
        try {
          const data = await res.json();
          setError(data.error ?? 'Failed to get quote. Please try again.');
        } catch {
          setError('Something went wrong. Please try again.');
        }
        return;
      }

      const data = await res.json();
      onQuoteReceived({ ...data, payToken: token });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const isValid =
    token !== '' &&
    network !== '' &&
    refundAddress !== '' &&
    addressError === '';

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="payToken" className="text-slate-900 dark:text-white">
          Pay with Token<span className="text-red-500"> *</span>
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
          Network<span className="text-red-500"> *</span>
        </Label>
        {networks.length === 1 ? (
          <Input
            id="payNetwork"
            value={network}
            disabled
            className="rounded-lg border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
          />
        ) : (
          <Select value={network} onValueChange={handleNetworkChange} disabled={!token}>
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
          {network ? `Your ${network} Refund Address` : 'Your Refund Address'}<span className="text-red-500"> *</span>
        </Label>
        <p className="text-pretty text-xs text-slate-500 dark:text-slate-400">
          If the swap fails or cannot be completed, your funds will be returned
          to this address.
        </p>
        <Input
          id="refundAddress"
          placeholder={
            network
              ? `Enter your ${network} address for refunds`
              : 'Select a network first'
          }
          disabled={!network}
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

type SelectCryptoStepProps = {
  invoiceId: string;
  onQuoteReceived: (quote: PaymentQuote) => void;
};
