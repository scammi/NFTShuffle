// Frameworks
import React, { useState } from 'react'
import { useWeb3Context } from '../context/Web3';

// Utils
import { shorthandAddressForDisplay } from '../utils/address';

// MUI
import { Button } from '@mui/material';

export const ConnectDisconnectButton = () => {
  const [ web3, , connect, disconnect ] = useWeb3Context();

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
    <Button onClick={() => { _connectWallet() }}>Connect</Button>
  );

  const DisconnectButton = () => {
    const displayAddress = shorthandAddressForDisplay(web3.connectedAccount);
    const [ buttonTittle, setButtonTittle ] = useState(displayAddress);


    

    return (
      <Button
       onClick={() => { _disconnectWallet() }}
       onMouseEnter={() => { setButtonTittle('Disconnect') }}
       onMouseLeave={() => { setButtonTittle(displayAddress) }}
      >
       {buttonTittle}
      </Button>
    );
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