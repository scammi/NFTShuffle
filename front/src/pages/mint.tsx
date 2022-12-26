import Box from '@mui/material/Box';
import React from 'react';

import { useWeb3Context } from '../context/Web3';
import { TicketView } from '../components/TicketView';
import { GLOBALS } from '../utils/globals';

import Seo from '../components/seo';
import Layout from '../components/layout';

const Mint = () => {
  const [ web3 ] = useWeb3Context();

  const isNetworkSupported = () => {
    const supportedNetworks = Object.keys(GLOBALS.CONTRACT_ADDRESSES.shuffleOne);
    return supportedNetworks.includes(String(web3.chainId));
  };
  return (
    <Layout>
      <Seo>
        <h1> MINT </h1>
        { web3.isConnected ? isNetworkSupported() ? <TicketView /> : 'Please select a supported network' : 
        'Please connect wallet' }
      </Seo>
    </Layout>
  );
};

export default Mint;

