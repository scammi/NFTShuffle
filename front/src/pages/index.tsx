import * as React from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import Seo from '../components/seo';
import Layout from '../components/layout';

import { NftGrid } from '../components/NftGrid';
import PaperFloat from "../components/PaperFloat";

const IndexPage = () => { 

  const styles = {
    relativeCard: {
      position: 'relative',
      maxWidth: '500px',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: '30'
    },
    alignCenter: { textAlign: 'center' } 
  }

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

      {/* <PaperFloat sxPaper={{ position: 'relative', top: 480, textAlign: 'center' }}>
        <Button href="/mint"> Mint </ Button>
      </PaperFloat> */}

      <Box sx={{
        top: 500,
        ...styles.relativeCard
       }}
      > 
        <Typography variant="h4" sx={styles.alignCenter} > How it works </Typography>
        <PaperFloat sxPaper={{ padding: 2 }}>
        <ol>
          <li><b> Purchase ticket </b> <br/>  Participate in the ongoing ticket auction, the ticket will give you the right to mint. </li> 
          <li><b>Wait...</b> <br/> What until all tickets are sold or the time limit is reach.  </li> 
          <li><b>Mint</b> <br/>Exchange your ticket for your NFT :) </li> 
        </ol>
        </PaperFloat>
      </Box>

      <Box sx={{
        top: 550,
        ...styles.relativeCard
       }}
      > 
        <Typography variant="h4" sx={styles.alignCenter} > FAQ </Typography>
        <PaperFloat sxPaper={{ paddingRight: 2, paddingY: 2, marginLeft: 0, marginRight: 0 }}>
        <ul style={{ padding: 0 }}>
           <li style={{listStyleType: 'none'}}><b>Q. What’s a NFT fair distribution?</b> <br/> <b>A.</b> A mechanism for safely lunching and distributing NFTs in a safe and fair manner. </li>
           <li style={{listStyleType: 'none'}}><b>Q. How long does the ticket buying last ? </b> <br/> <b>A.</b> The ticket window is one week, but it can also end once all tickets are sold. </li>
        </ul>
        </PaperFloat>
      </Box>

      <Box sx={{
        top: 600,
        ...styles.relativeCard
       }}
      > 
        <Typography variant="h4" sx={styles.alignCenter} > About Shuffle </Typography>
        <PaperFloat sxPaper={{ padding: 2 }}>
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          </Typography>
          <br/>
          <Typography variant="body1">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          </Typography>
          <br/>
          <Typography variant="body1">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </Typography>
        </PaperFloat>
      </Box>
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
