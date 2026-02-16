'use client';

import { useState, useCallback } from 'react';
import { isTerminalStatus, type TerminalInfo } from '@/lib/invoice/status';
import { isDepositDetectedSdk, type PaymentQuote } from '@/lib/invoice/payment';
import { InvoiceSummary } from './invoice-summary';
import { SelectCryptoStep } from './select-crypto-step';
import { DepositStep } from './deposit-step';
import { TerminalStep } from './terminal-step';

export function PaymentFlow(props: PaymentFlowProps) {
  const [step, setStep] = useState<Step>(() => getInitialStep(props));
  const [quote, setQuote] = useState<PaymentQuote | null>(null);
  const [terminalInfo, setTerminalInfo] = useState<TerminalInfo | null>(null);
  const [liveStatus, setLiveStatus] = useState(() =>
    getInitialDisplayStatus(props.status, props.initialSdkStatus)
  );

  const handleStatusChange = useCallback(
    (appStatus: string, sdkStatus: string | null) => {
      if (isDepositDetectedSdk(sdkStatus)) {
        setLiveStatus('DEPOSIT_DETECTED');
      } else {
        setLiveStatus(appStatus);
      }
    },
    []
  );

  const handleTerminal = useCallback(
    (info: TerminalInfo) => {
      setTerminalInfo(info);
      setLiveStatus(info.status);
      setStep('TERMINAL');
    },
    []
  );

  return (
    <>
      <InvoiceSummary {...props.summary} status={liveStatus} />

      {step === 'TERMINAL' ? (
        <TerminalStep
          status={terminalInfo?.status ?? props.status}
          paidAt={terminalInfo?.paidAt ?? props.paidAt}
        />
      ) : step === 'DEPOSIT' ? (
        <DepositStep
          invoiceId={props.invoiceId}
          depositAddress={props.depositAddress}
          depositMemo={props.depositMemo}
          amountIn={props.amountIn}
          payToken={props.payToken}
          expiresAt={props.expiresAt}
          initialSdkStatus={props.initialSdkStatus}
          quote={quote}
          onTerminal={handleTerminal}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <SelectCryptoStep
          invoiceId={props.invoiceId}
          onQuoteReceived={(q) => {
            setQuote(q);
            setStep('DEPOSIT');
          }}
        />
      )}
    </>
  );
}

function getInitialStep(props: PaymentFlowProps): Step {
  if (isTerminalStatus(props.status)) return 'TERMINAL';
  if (props.depositAddress) return 'DEPOSIT';
  return 'SELECT_CRYPTO';
}

function getInitialDisplayStatus(
  appStatus: string,
  sdkStatus: string | null
): string {
  if (isDepositDetectedSdk(sdkStatus)) return 'DEPOSIT_DETECTED';
  return appStatus;
}

type Step = 'SELECT_CRYPTO' | 'DEPOSIT' | 'TERMINAL';

export type InvoiceSummaryData = {
  amount: string;
  receiveToken: string;
  receiveNetwork: string;
  description: string | null;
  buyerName: string | null;
  buyerEmail: string | null;
  buyerAddress: string | null;
};

export type PaymentFlowProps = {
  invoiceId: string;
  status: string;
  initialSdkStatus: string | null;
  depositAddress: string | null;
  depositMemo: string | null;
  paidAt: string | null;
  amountIn: string | null;
  payToken: string | null;
  expiresAt: string | null;
  summary: InvoiceSummaryData;
};
