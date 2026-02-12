'use client';

import { useState } from 'react';
import { SelectCryptoStep } from './select-crypto-step';
import { ShowDepositStep } from './show-deposit-step';
import { AwaitingPaymentStep } from './awaiting-payment-step';
import { TerminalStep } from './terminal-step';

export function PaymentFlow(props: PaymentFlowProps) {
  const [step, setStep] = useState<Step>(() => getInitialStep(props));
  const [quote, setQuote] = useState<QuoteResponse | null>(null);

  if (step === 'TERMINAL') {
    return <TerminalStep status={props.status} paidAt={props.paidAt} />;
  }

  if (step === 'AWAITING_PAYMENT') {
    return (
      <AwaitingPaymentStep
        invoiceId={props.invoiceId}
        depositAddress={props.depositAddress}
        depositMemo={props.depositMemo}
        quote={quote}
        onTerminal={() => setStep('TERMINAL')}
      />
    );
  }

  if (step === 'SHOW_DEPOSIT') {
    return (
      <ShowDepositStep
        quote={quote!}
        onConfirmSent={() => setStep('AWAITING_PAYMENT')}
      />
    );
  }

  return (
    <SelectCryptoStep
      invoiceId={props.invoiceId}
      onQuoteReceived={(q) => {
        setQuote(q);
        setStep('SHOW_DEPOSIT');
      }}
    />
  );
}

function getInitialStep(props: PaymentFlowProps): Step {
  const terminalStatuses = ['COMPLETED', 'FAILED', 'REFUNDED', 'EXPIRED'];
  if (terminalStatuses.includes(props.status)) return 'TERMINAL';
  if (props.depositAddress) return 'AWAITING_PAYMENT';
  return 'SELECT_CRYPTO';
}

type Step = 'SELECT_CRYPTO' | 'SHOW_DEPOSIT' | 'AWAITING_PAYMENT' | 'TERMINAL';

export type PaymentFlowProps = {
  invoiceId: string;
  status: string;
  depositAddress: string | null;
  depositMemo: string | null;
  paidAt: string | null;
};

export type QuoteResponse = {
  amountIn: string;
  payToken: string;
  depositAddress: string;
  depositMemo?: string;
  timeEstimate?: string;
};
