import React from 'react'
import { useEthers } from '@usedapp/core'

export const MetamaskConnect = () => {
  const { account, activateBrowserWallet } = useEthers()

  const ConnectButton = () => (
    <div>
      <button onClick={() => activateBrowserWallet()}>Connect</button>
      <p>Connect to wallet.</p>
    </div>
  )

  return (
    <div>
      {account && (
        <div>
          <div className="inline">
            <div className="account">{account}</div>
          </div>
          <br />
        </div>
      )}
      {!account && <ConnectButton />}
    </div>
  )
}