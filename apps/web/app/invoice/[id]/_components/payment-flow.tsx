'use client';

import { useState } from 'react';
import { SelectCryptoStep } from './select-crypto-step';
import { DepositStep, type TerminalInfo } from './deposit-step';
import { TerminalStep } from './terminal-step';

export function PaymentFlow(props: PaymentFlowProps) {
  const [step, setStep] = useState<Step>(() => getInitialStep(props));
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [terminalInfo, setTerminalInfo] = useState<TerminalInfo | null>(null);

  if (step === 'TERMINAL') {
    return (
      <TerminalStep
        status={terminalInfo?.status ?? props.status}
        paidAt={terminalInfo?.paidAt ?? props.paidAt}
      />
    );
  }

  if (step === 'DEPOSIT') {
    return (
      <DepositStep
        invoiceId={props.invoiceId}
        depositAddress={props.depositAddress}
        depositMemo={props.depositMemo}
        quote={quote}
        onTerminal={(info) => {
          setTerminalInfo(info);
          setStep('TERMINAL');
        }}
      />
    );
  }

  return (
    <SelectCryptoStep
      invoiceId={props.invoiceId}
      onQuoteReceived={(q) => {
        setQuote(q);
        setStep('DEPOSIT');
      }}
    />
  );
}

function getInitialStep(props: PaymentFlowProps): Step {
  const terminalStatuses = ['COMPLETED', 'FAILED', 'REFUNDED', 'EXPIRED'];
  if (terminalStatuses.includes(props.status)) return 'TERMINAL';
  if (props.depositAddress) return 'DEPOSIT';
  return 'SELECT_CRYPTO';
}

type Step = 'SELECT_CRYPTO' | 'DEPOSIT' | 'TERMINAL';

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
