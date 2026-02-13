import {
  OneClickService,
  TokenResponse,
} from '@defuse-protocol/one-click-sdk-typescript';
import { TOKEN_NETWORK_MAP, type Token, type Network } from '@/lib/invoice/tokens';
import { initNearSdk } from './client';

export async function getDefuseAssetId(
  token: Token,
  network: Network,
): Promise<string> {
  const match = await findToken(token, network);
  if (!match) {
    throw new Error(`No Defuse asset ID for ${token}:${network}`);
  }
  return match.assetId;
}

export async function toSmallestUnits(
  amount: string,
  token: Token,
): Promise<string> {
  const decimals = await getTokenDecimals(token);
  const [whole = '0', fraction = ''] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return (
    BigInt(whole) * 10n ** BigInt(decimals) + BigInt(paddedFraction)
  ).toString();
}

export async function getTokenDecimals(token: Token): Promise<number> {
  const network = TOKEN_NETWORK_MAP[token][0];
  const match = await findToken(token, network);
  if (!match) {
    throw new Error(`Unknown token decimals for ${token}`);
  }
  return match.decimals;
}

async function findToken(
  token: Token,
  network: Network,
): Promise<TokenResponse | undefined> {
  const tokens = await getTokens();
  const blockchain = NETWORK_TO_BLOCKCHAIN[network];
  return tokens.find(
    (t) => t.symbol === token && t.blockchain === blockchain,
  );
}

let cachedTokens: Promise<Array<TokenResponse>> | null = null;
let cacheExpiry = 0;

function getTokens(): Promise<Array<TokenResponse>> {
  if (cachedTokens && Date.now() < cacheExpiry) {
    return cachedTokens;
  }

  initNearSdk();
  cachedTokens = OneClickService.getTokens().then(
    (tokens) => {
      cacheExpiry = Date.now() + 60 * 60 * 1000;
      return tokens;
    },
    (error) => {
      cachedTokens = null;
      cacheExpiry = 0;
      throw error;
    },
  );
  cacheExpiry = Infinity;
  return cachedTokens;
}

const NETWORK_TO_BLOCKCHAIN: Record<Network, TokenResponse.blockchain> = {
  Ethereum: TokenResponse.blockchain.ETH,
  Solana: TokenResponse.blockchain.SOL,
  Bitcoin: TokenResponse.blockchain.BTC,
};
