/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */
const React = require("react");
const { getDefaultProvider } = require("ethers")
const { DAppProvider, Mainnet, Goerli } = require("@usedapp/core");

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