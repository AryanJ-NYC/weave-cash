import { z } from 'zod';
import WAValidator from 'multicoin-address-validator';
import {
  TOKENS,
  TOKEN_NETWORK_MAP,
  NETWORK_CURRENCY_MAP,
  type Network,
} from './tokens';

export function validateWalletAddress(
  address: string,
  network: Network
): boolean {
  const currencyName = NETWORK_CURRENCY_MAP[network];
  return WAValidator.validate(address, currencyName);
}

export const createInvoiceSchema = z
  .object({
    receiveToken: z.enum(TOKENS),
    receiveNetwork: z.string(),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .refine(
        (v) => !isNaN(Number(v)) && Number(v) > 0,
        'Must be a positive number'
      ),
    walletAddress: z.string().min(1, 'Wallet address is required'),
    buyerName: z.string().optional(),
    buyerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
    buyerAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const validNetworks: readonly Network[] =
      TOKEN_NETWORK_MAP[data.receiveToken];
    if (!validNetworks.includes(data.receiveNetwork as Network)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${data.receiveNetwork} is not a valid network for ${data.receiveToken}`,
        path: ['receiveNetwork'],
      });
      return;
    }

    if (
      !validateWalletAddress(data.walletAddress, data.receiveNetwork as Network)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid wallet address for ${data.receiveNetwork}`,
        path: ['walletAddress'],
      });
    }
  });

type CreateInvoiceInput = z.input<typeof createInvoiceSchema>;

export type { CreateInvoiceInput };
