import { describe, expect, it } from 'vitest';
import {
  TOKENS,
  TOKEN_NETWORK_MAP,
  NETWORK_CURRENCY_MAP,
  getNetworksForToken,
} from './tokens';
import { validateWalletAddress } from './validation';

describe('invoice token offerings', () => {
  it('includes requested quote assets', () => {
    expect(TOKENS).toEqual(expect.arrayContaining(['ZEC', 'XAUT', 'PAXG']));
  });

  it('supports USDT on Tron in token-network map', () => {
    expect(getNetworksForToken('USDT')).toEqual(
      expect.arrayContaining(['Tron'])
    );
  });

  it('maps new networks to validator currencies', () => {
    expect(NETWORK_CURRENCY_MAP.Zcash).toBe('zec');
    expect(NETWORK_CURRENCY_MAP.Tron).toBe('trx');
  });
});

describe('wallet validation for new quote offerings', () => {
  it('accepts valid Tron addresses', () => {
    expect(
      validateWalletAddress('TNDzfERDpxLDS2w1q6yaFC7pzqaSQ3Bg3r', 'Tron')
    ).toBe(true);
  });

  it('accepts valid Zcash transparent addresses', () => {
    expect(
      validateWalletAddress('t1U9yhDa5XEjgfnTgZoKddeSiEN1aoLkQxq', 'Zcash')
    ).toBe(true);
  });

  it('rejects network/token pairings that are not allowed', () => {
    expect(TOKEN_NETWORK_MAP.XAUT).toEqual(['Ethereum']);
    expect(TOKEN_NETWORK_MAP.PAXG).toEqual(['Ethereum']);
  });
});
