import React from 'react'

export const MetamaskConnect = () => {
  let account = void(0);
  
  const ConnectButton = () => (
    <div>
      <button onClick={() => {} }>Connect</button>
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