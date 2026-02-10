import {
  OneClickService,
  GetExecutionStatusResponse,
} from '@defuse-protocol/one-click-sdk-typescript';
import { initNearSdk } from './client';

export async function getSwapStatus(
  depositAddress: string,
  depositMemo?: string
): Promise<GetExecutionStatusResponse> {
  initNearSdk();
  return OneClickService.getExecutionStatus(depositAddress, depositMemo);
}

export { GetExecutionStatusResponse };
