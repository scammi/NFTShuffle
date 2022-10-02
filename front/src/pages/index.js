import * as React from "react";

import Seo from "../components/seo";
import Layout from "../components/layout";
import * as styles from "../components/index.module.css";
import { TicketView } from "../components/TicketView";
import { useWeb3Context } from "../context/Web3";

const IndexPage = () => { 
  const [ web3 ] = useWeb3Context();
  
  return (
    <Layout>
      <Seo title="Home" />
      <div className={styles.textCenter}>
        <h1>
          Welcome to <b>NFTshuffle!</b>
        </h1>
          { web3.isConnected && <TicketView />}
      </div>
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
