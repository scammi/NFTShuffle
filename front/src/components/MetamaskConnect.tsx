import React from 'react'
import { useWeb3Context } from '../context/Web3';

import { shorthandAddressForDisplay } from '../utils/address';

export const MetamaskConnect = () => {
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
    <div>
      <button onClick={() => { _connectWallet() }}>Connect</button>
    </div>
  );

  const DisconnectButton = () => (
    <button onClick={() => { _disconnectWallet() }}>Disconnect</button>
  )

  return (
    <div>
      {web3.isConnected && (
        <div>
          <div className="inline">
            <div className="account">{shorthandAddressForDisplay(web3.connectedAccount)}</div>
            <DisconnectButton/>
          </div>
          <br />
        </div>
      )}
      {!web3.isConnected && <ConnectButton />}
    </div>
  )
}