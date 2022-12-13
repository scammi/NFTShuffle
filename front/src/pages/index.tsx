import * as React from "react";

import Seo from '../components/seo';
import Layout from '../components/layout';

import { useWeb3Context } from '../context/Web3';
import { TicketView } from '../components/TicketView';
import { GLOBALS } from '../utils/globals';
import { NftGrid } from '../components/NftGrid';

import Box from '@mui/material/Box';

const IndexPage = () => { 
  const [ web3 ] = useWeb3Context();

  const isNetworkSupported = () => {
    const supportedNetworks = Object.keys(GLOBALS.CONTRACT_ADDRESSES.shuffleOne);
    return supportedNetworks.includes(String(web3.chainId));
  };

  return (
    <Layout>
      <Seo title="Home" />
      <Box sx={{ textAlign: 'center' }}>
        <h1>
          Welcome to <b>NFTshuffle!</b>
        </h1>
        {
          web3.isConnected ? isNetworkSupported() ? <TicketView /> : 'Please select a supported network' : 
          'Please connect wallet'
        }
      </Box>
      <NftGrid />
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default IndexPage
