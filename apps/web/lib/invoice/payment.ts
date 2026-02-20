import { isTerminalStatus } from './status';

export type PaymentQuote = {
  amountIn: string;
  amountOut: string;
  payToken: string;
  payNetwork: string;
  depositAddress: string;
  depositMemo?: string;
  timeEstimate?: string;
  expiresAt: string;
};

export type InvoiceNormalizedResponse = {
  id: string;
  status: string;
  invoice: InvoiceDetails;
  paymentInstructions: PaymentInstructions;
  timeline: InvoiceTimeline;
};

export type InvoiceDetails = {
  id: string;
  amount: string;
  receiveToken: string;
  receiveNetwork: string;
  walletAddress: string;
  description: string | null;
  buyerName: string | null;
  buyerEmail: string | null;
  buyerAddress: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PaymentInstructions = {
  payToken: string | null;
  payNetwork: string | null;
  depositAddress: string | null;
  depositMemo: string | null;
  amountIn: string | null;
  expiresAt: string | null;
  paidAt: string | null;
};

export type InvoiceTimeline = {
  currentStatus: string;
  isTerminal: boolean;
  createdAt: string;
  quotedAt: string | null;
  expiresAt: string | null;
  paidAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  refundedAt: string | null;
  expiredAt: string | null;
  lastStatusChangeAt: string;
};

export type TrackerPhase =
  | 'selecting'
  | 'awaitingDeposit'
  | 'processing'
  | 'terminal';

export type TrackerInstructions = {
  payToken: string | null;
  payNetwork: string | null;
  depositAddress: string | null;
  depositMemo: string | null;
  amountIn: string | null;
  expiresAt: string | null;
  paidAt: string | null;
};

export type InvoiceSummaryData = {
  amount: string;
  receiveToken: string;
  receiveNetwork: string;
  description: string | null;
  buyerName: string | null;
  buyerEmail: string | null;
  buyerAddress: string | null;
};

export function derivePhaseFromSnapshot(
  status: string,
  hasDepositAddress: boolean
): TrackerPhase {
  if (isTerminalStatus(status)) return 'terminal';
  if (status === 'PROCESSING') return 'processing';
  if (status === 'AWAITING_DEPOSIT' || hasDepositAddress)
    return 'awaitingDeposit';
  return 'selecting';
}

export function getInvoiceSummaryData(
  invoice: InvoiceNormalizedResponse
): InvoiceSummaryData {
  return {
    amount: invoice.invoice.amount,
    receiveToken: invoice.invoice.receiveToken,
    receiveNetwork: invoice.invoice.receiveNetwork,
    description: invoice.invoice.description,
    buyerName: invoice.invoice.buyerName,
    buyerEmail: invoice.invoice.buyerEmail,
    buyerAddress: invoice.invoice.buyerAddress,
  };
}
