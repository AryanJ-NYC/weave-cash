export type PaymentQuote = {
  amountIn: string;
  payToken: string;
  depositAddress: string;
  depositMemo?: string;
  timeEstimate?: string;
  expiresAt: string;
};

export function isDepositDetectedSdk(sdkStatus: string | null): boolean {
  if (!sdkStatus) return false;
  return DETECTED_SDK_STATUSES.has(sdkStatus);
}

const DETECTED_SDK_STATUSES = new Set([
  'KNOWN_DEPOSIT_TX',
  'PROCESSING',
  'SUCCESS',
]);

export type InvoiceStatusResponse = {
  status: string;
  sdkStatus: string | null;
  depositAddress: string | null;
  depositMemo: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  payToken: string | null;
  amountIn: string | null;
};
