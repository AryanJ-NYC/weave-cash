'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import type { Token, Network, CreateInvoiceInput } from '@/lib/invoice';

export default function CreateInvoicePage() {
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  if (invoiceId) {
    return (
      <InvoiceSuccess
        invoiceId={invoiceId}
        onReset={() => setInvoiceId(null)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 md:py-24">
      <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-900 dark:text-white">
            Create Invoice
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Choose your preferred crypto and share a payment link with your
            customer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceForm onSuccess={setInvoiceId} />
        </CardContent>
      </Card>
    </div>
  );
}

function InvoiceSuccess({
  invoiceId,
  onReset,
}: {
  invoiceId: string;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const invoiceUrl = `${window.location.origin}/invoice/${invoiceId}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(invoiceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 md:py-24">
      <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-slate-900 dark:text-white">
            Invoice Created
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Share this link with your customer to receive payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <QRCodeSVG value={invoiceUrl} size={200} />
          </div>

          <div className="flex w-full items-center gap-2">
            <Input
              value={invoiceUrl}
              readOnly
              className="rounded-lg border-slate-300 bg-white text-sm focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
            />
            <Button
              variant="outline"
              onClick={handleCopy}
              className="shrink-0 border-slate-300 dark:border-slate-700"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <Button
            variant="secondary"
            onClick={onReset}
            className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Create Another Invoice
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InvoiceForm({ onSuccess }: { onSuccess: (id: string) => void }) {
  const [token, setToken] = useState<Token | ''>('');
  const [network, setNetwork] = useState('');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [addressError, setAddressError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const networks = token ? getNetworksForToken(token) : [];

  function handleTokenChange(value: string) {
    setToken(value as Token);
    const availableNetworks = getNetworksForToken(value as Token);
    setNetwork(
      availableNetworks.length === 1 ? (availableNetworks[0] ?? '') : ''
    );
    setAddressError('');
    setWalletAddress('');
  }

  function handleAddressChange(value: string) {
    setWalletAddress(value);
    if (value && network) {
      const valid = validateWalletAddress(value, network as Network);
      setAddressError(valid ? '' : `Invalid wallet address for ${network}`);
    } else {
      setAddressError('');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setSubmitting(true);

    const body: CreateInvoiceInput = {
      receiveToken: token as Token,
      receiveNetwork: network,
      amount,
      walletAddress,
      ...(buyerName && { buyerName }),
      ...(buyerEmail && { buyerEmail }),
      ...(buyerAddress && { buyerAddress }),
    };

    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setFieldErrors(data.error ?? {});
        return;
      }

      const { id } = await res.json();
      onSuccess(id);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="token" className="text-slate-900 dark:text-white">
          Token
        </Label>
        <Select value={token} onValueChange={handleTokenChange}>
          <SelectTrigger
            id="token"
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
        <FieldError errors={fieldErrors.receiveToken} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="network" className="text-slate-900 dark:text-white">
          Network
        </Label>
        {networks.length === 1 ? (
          <Input
            id="network"
            value={network}
            disabled
            className="rounded-lg border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"
          />
        ) : (
          <Select value={network} onValueChange={setNetwork} disabled={!token}>
            <SelectTrigger
              id="network"
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
        <FieldError errors={fieldErrors.receiveNetwork} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="amount" className="text-slate-900 dark:text-white">
          Amount{token ? ` (in ${token})` : ''}
        </Label>
        <Input
          id="amount"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-lg border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
        />
        <FieldError errors={fieldErrors.amount} />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="walletAddress"
          className="text-slate-900 dark:text-white"
        >
          {network ? `Your ${network} Address` : 'Your Wallet Address'}
        </Label>
        <Input
          id="walletAddress"
          placeholder={
            network
              ? `Enter your ${network} address`
              : 'Enter your wallet address'
          }
          value={walletAddress}
          onChange={(e) => handleAddressChange(e.target.value)}
          className="rounded-lg border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
        />
        {addressError && <p className="text-sm text-red-500">{addressError}</p>}
        <FieldError errors={fieldErrors.walletAddress} />
      </div>

      <div className="border-t border-slate-200 pt-5 dark:border-slate-800">
        <p className="mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          Optional buyer details
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="buyerName"
              className="text-slate-900 dark:text-white"
            >
              Name
            </Label>
            <Input
              id="buyerName"
              placeholder="Customer name"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="rounded-lg border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="buyerEmail"
              className="text-slate-900 dark:text-white"
            >
              Email
            </Label>
            <Input
              id="buyerEmail"
              type="email"
              placeholder="customer@example.com"
              value={buyerEmail}
              onChange={(e) => setBuyerEmail(e.target.value)}
              className="rounded-lg border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
            />
            <FieldError errors={fieldErrors.buyerEmail} />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="buyerAddress"
              className="text-slate-900 dark:text-white"
            >
              Address
            </Label>
            <Input
              id="buyerAddress"
              placeholder="Customer address"
              value={buyerAddress}
              onChange={(e) => setBuyerAddress(e.target.value)}
              className="rounded-lg border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="mt-2 w-full rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 dark:bg-blue-500 dark:shadow-blue-500/25 dark:hover:bg-blue-600"
      >
        {submitting ? 'Creating...' : 'Create Invoice'}
      </Button>
    </form>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-sm text-red-500">{errors[0]}</p>;
}
