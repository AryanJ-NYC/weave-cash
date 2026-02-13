export type PaymentQuote = {
  amountIn: string;
  payToken: string;
  depositAddress: string;
  depositMemo?: string;
  timeEstimate?: string;
  expiresAt: string;
};

export type InvoiceStatusResponse = {
  status: string;
  depositAddress: string | null;
  depositMemo: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  payToken: string | null;
  amountIn: string | null;
};
