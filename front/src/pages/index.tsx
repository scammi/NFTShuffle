import * as React from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import Seo from '../components/seo';
import Layout from '../components/layout';

import { NftGrid } from '../components/NftGrid';
import PaperFloat from "../components/PaperFloat";

const IndexPage = () => { 

  return (
    <Layout>
      <Seo title="Home" />

      <Grid container justifyContent="center">
        <Grid item>
          <Typography variant="h2">
            Welcome to NFTshuffle
          </Typography>
        </Grid>
      </Grid>

      <NftGrid />

      <PaperFloat sxPaper={{ maxWidth: 100, position: 'relative', top: 520, left: '35vw', textAlign: 'center' }}>
        <Button href="/mint"> Mint </ Button>
      </PaperFloat>
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
