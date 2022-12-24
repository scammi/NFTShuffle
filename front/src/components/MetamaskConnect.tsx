import React from 'react'
import { useWeb3Context } from '../context/Web3';

import { shorthandAddressForDisplay } from '../utils/address';

export const ConnectDisconnectButton = () => {
  const [web3, , connect, disconnect] = useWeb3Context();

  const _connectWallet = async () => {
    try {
      await connect();
    } catch (err) {
      console.error(err);
    }
  }

  const _disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error(err);
    }
  }

  const ConnectButton = () => (
    <button onClick={() => { _connectWallet() }}>Connect</button>
  );

  const DisconnectButton = () => {
    const displayAddress = shorthandAddressForDisplay(web3.connectedAccount);

    return (<button onClick={() => { _disconnectWallet() }}>{displayAddress}</button>)
  };

  return (
    <div>
      {web3.isConnected && (
        <DisconnectButton/>
      )}
      {!web3.isConnected && <ConnectButton />}
    </div>
  )
}