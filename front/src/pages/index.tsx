import * as React from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Seo from '../components/seo';
import Layout from '../components/layout';

import { NftGrid } from '../components/NftGrid';

const IndexPage = () => { 

  return (
    <Layout>
      <Seo title="Home" />
      <Box sx={{ textAlign: 'center' }}>
        <h1>
          Welcome to <b>NFTshuffle</b>
        </h1>
        <Button href="/mint"> Mint </ Button>
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
