import {
  OneClickService,
  GetExecutionStatusResponse,
  SubmitDepositTxResponse,
} from '@defuse-protocol/one-click-sdk-typescript';
import { initNearSdk } from './client';

export async function getSwapStatus(
  depositAddress: string,
  depositMemo?: string
): Promise<GetExecutionStatusResponse> {
  initNearSdk();
  return OneClickService.getExecutionStatus(depositAddress, depositMemo);
}

export async function submitSwapDepositTx(
  params: SubmitSwapDepositTxParams
): Promise<SubmitDepositTxResponse> {
  initNearSdk();
  return OneClickService.submitDepositTx({
    txHash: params.txHash,
    depositAddress: params.depositAddress,
    memo: params.memo,
  });
}

type SubmitSwapDepositTxParams = {
  txHash: string;
  depositAddress: string;
  memo?: string;
};

export type { GetExecutionStatusResponse, SubmitDepositTxResponse };
