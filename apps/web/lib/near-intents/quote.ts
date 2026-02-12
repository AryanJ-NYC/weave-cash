import {
  OneClickService,
  QuoteRequest,
} from '@defuse-protocol/one-click-sdk-typescript';
import type { QuoteResponse } from '@defuse-protocol/one-click-sdk-typescript';
import { getDefuseAssetId, toSmallestUnits } from './assets';
import { initNearSdk } from './client';
import type { Token, Network } from '@/lib/invoice';

export async function getSwapQuote(params: {
  payToken: Token;
  payNetwork: Network;
  receiveToken: Token;
  receiveNetwork: Network;
  amount: string;
  recipientAddress: string;
  refundAddress: string;
}): Promise<QuoteResponse> {
  initNearSdk();

  const originAsset = await getDefuseAssetId(params.payToken, params.payNetwork);
  const destinationAsset = await getDefuseAssetId(
    params.receiveToken,
    params.receiveNetwork,
  );
  const amountInSmallestUnits = await toSmallestUnits(
    params.amount,
    params.receiveToken,
  );

  const deadline = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  const quoteRequest: QuoteRequest = {
    dry: false,
    swapType: QuoteRequest.swapType.EXACT_OUTPUT,
    slippageTolerance: 100,
    originAsset,
    depositType: QuoteRequest.depositType.ORIGIN_CHAIN,
    destinationAsset,
    amount: amountInSmallestUnits,
    refundTo: params.refundAddress,
    refundType: QuoteRequest.refundType.ORIGIN_CHAIN,
    recipient: params.recipientAddress,
    recipientType: QuoteRequest.recipientType.DESTINATION_CHAIN,
    deadline,
    referral: 'weave-cash',
  };

  console.log('Defuse quote request:', JSON.stringify(quoteRequest, null, 2));

  return OneClickService.getQuote(quoteRequest);
}

export type { QuoteResponse };
