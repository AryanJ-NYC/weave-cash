import { useState } from 'react';
import { getNetworksForToken, type Token, type Network } from '@/lib/invoice/tokens';
import { validateWalletAddress } from '@/lib/invoice/validation';

export function useTokenNetwork() {
  const [token, setToken] = useState<Token | ''>('');
  const [network, setNetwork] = useState<Network | ''>('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');

  const networks = token ? getNetworksForToken(token) : [];

  function handleTokenChange(value: string) {
    setToken(value as Token);
    const availableNetworks = getNetworksForToken(value as Token);
    setNetwork(availableNetworks.length === 1 ? availableNetworks[0]! : '');
    setAddressError('');
    setAddress('');
  }

  function handleNetworkChange(value: string) {
    setNetwork(value as Network);
  }

  function handleAddressChange(value: string) {
    setAddress(value);
    if (value && network) {
      const valid = validateWalletAddress(value, network);
      setAddressError(valid ? '' : `Invalid wallet address for ${network}`);
    } else {
      setAddressError('');
    }
  }

  return {
    token,
    network,
    networks,
    address,
    addressError,
    handleTokenChange,
    handleNetworkChange,
    handleAddressChange,
    setAddress,
  };
}
