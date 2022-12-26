// Frameworks
import React, { useState } from 'react'

// Components
import { useWeb3Context } from '../context/Web3';
import PaperFloat from './PaperFloat';

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
    <Button sx={{ color: 'black' }} onClick={() => { _connectWallet() }}>Connect</Button>
  );

  const DisconnectButton = () => {
    const displayAddress = shorthandAddressForDisplay(web3.connectedAccount);
    const [ buttonTittle, setButtonTittle ] = useState(displayAddress);

    return (
      <Button
       sx={{ color: 'black' }}
       onClick={() => { _disconnectWallet() }}
       onMouseEnter={() => { setButtonTittle('Disconnect') }}
       onMouseLeave={() => { setButtonTittle(displayAddress) }}
      >
       {buttonTittle}
      </Button>
    );
  };

  return (
    <PaperFloat>
      {web3.isConnected && (
        <DisconnectButton/>
      )}
      {!web3.isConnected && <ConnectButton />}
    </PaperFloat>
  )
}