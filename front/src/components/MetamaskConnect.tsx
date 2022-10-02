import React from 'react'
import { useWeb3Context } from '../context/Web3';

export const MetamaskConnect = () => {
  const [web3, , connect] = useWeb3Context();
  console.log(web3.isConnected);
  console.log(web3)

  const _connectWallet = async () => {
    try {
      await connect();
    } catch (err) {
      console.error(err);
    }
  }

  const ConnectButton = () => (
    <div>
      <button onClick={() => { _connectWallet() }}>Connect</button>
      <p>Connect to wallet.</p>
    </div>
  )

  return (
    <div>
      {web3.isConnected && (
        <div>
          <div className="inline">
            <div className="account">{web3.connectedAccount}</div>
          </div>
          <br />
        </div>
      )}
      {!web3.isConnected && <ConnectButton />}
    </div>
  )
}