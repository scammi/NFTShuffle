/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */
import React from "react";
import { DAppProvider, Mainnet, Goerli } from "@usedapp/core";
import { getDefaultProvider } from "ethers";

const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider('mainnet'),
    [Goerli.chainId]: getDefaultProvider('goerli'),
  },
}

exports.wrapRootElement = ({ element }) => {
  return (
    <DAppProvider config={config}>
      {element}
    </DAppProvider>
  )
}