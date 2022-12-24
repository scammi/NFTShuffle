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
      <Grid 
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <Typography>
            Welcome to NFTshuffle
          </Typography>
        </Grid>
        <Grid item>
          <PaperFloat sxPaper={{ maxWidth: 80 }}>
            <Button href="/mint"> Mint </ Button>
          </PaperFloat>
        </Grid>
      </Grid>
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
