import type { Token } from '@/lib/invoice';
import type { Network } from '@/lib/invoice';

export function getDefuseAssetId(token: Token, network: Network): string {
  const key = `${token}:${network}`;
  const assetId = ASSET_MAP[key];
  if (!assetId) {
    throw new Error(`No Defuse asset ID for ${key}`);
  }
  return assetId;
}

export function toSmallestUnits(amount: string, token: Token): string {
  const decimals = getTokenDecimals(token);
  const [whole = '0', fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return (BigInt(whole) * 10n ** BigInt(decimals) + BigInt(paddedFraction)).toString();
}

export function getTokenDecimals(token: Token): number {
  const decimals = TOKEN_DECIMALS[token];
  if (decimals === undefined) {
    throw new Error(`Unknown token decimals for ${token}`);
  }
  return decimals;
}

const ASSET_MAP: Record<string, string> = {
  'USDC:Ethereum': 'nep141:eth-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.omft.near',
  'USDC:Solana': 'nep141:sol-5ce3bf3a31af18be40ba30f721101b4341690186.omft.near',
  'USDT:Ethereum': 'nep141:eth-0xdac17f958d2ee523a2206206994597c13d831ec7.omft.near',
  'USDT:Solana': 'nep141:sol-c800a4bd850783ccb82c2b7e84175443606352.omft.near',
  'ETH:Ethereum': 'nep141:eth.omft.near',
  'BTC:Bitcoin': 'nep141:btc.omft.near',
  'SOL:Solana': 'nep141:sol.omft.near',
};

const TOKEN_DECIMALS: Record<string, number> = {
  USDC: 6,
  USDT: 6,
  ETH: 18,
  BTC: 8,
  SOL: 9,
};
