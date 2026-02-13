export const TOKENS = ['USDC', 'USDT', 'ETH', 'BTC', 'SOL'] as const;

export const TOKEN_NETWORK_MAP = {
  USDC: ['Ethereum', 'Solana'],
  USDT: ['Ethereum', 'Solana'],
  ETH: ['Ethereum'],
  BTC: ['Bitcoin'],
  SOL: ['Solana'],
} as const satisfies Record<Token, readonly Network[]>;

export function getNetworksForToken(token: Token): readonly Network[] {
  return TOKEN_NETWORK_MAP[token];
}

export const NETWORK_CURRENCY_MAP = {
  Bitcoin: 'btc',
  Ethereum: 'eth',
  Solana: 'sol',
} as const;

type Token = (typeof TOKENS)[number];
type Network = keyof typeof NETWORK_CURRENCY_MAP;

export type { Token, Network };
