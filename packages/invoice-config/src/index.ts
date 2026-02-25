import tokensConfig from '../tokens.json' with { type: 'json' };

type Token = keyof typeof tokensConfig.tokenNetworkMap;
type Network = keyof typeof tokensConfig.networkCurrencyMap;
type NonEmptyNetworkList = readonly [Network, ...Network[]];

const TOKENS = tokensConfig.tokens as unknown as readonly [Token, ...Token[]];
const TOKEN_NETWORK_MAP = tokensConfig.tokenNetworkMap as unknown as Record<
  Token,
  NonEmptyNetworkList
>;
const NETWORK_CURRENCY_MAP = tokensConfig.networkCurrencyMap as Record<
  Network,
  string
>;

function getNetworksForToken(token: Token): NonEmptyNetworkList {
  return TOKEN_NETWORK_MAP[token];
}

export {
  TOKENS,
  TOKEN_NETWORK_MAP,
  NETWORK_CURRENCY_MAP,
  getNetworksForToken,
  type Token,
  type Network,
};
