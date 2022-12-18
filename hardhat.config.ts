import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";

import 'solidity-coverage'
import "hardhat-gas-reporter"
import "hardhat-storage-layout"

import dotenv from "dotenv";

dotenv.config();

const forkingUrl = process.env.FORK_URL || ''
const mnemonic = process.env.DEV_MNEMONIC || ''
const goerliUrl = process.env.GOERLI_RPC || ''
const privateKey = process.env.PRIVATE_KEY || ''

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
        optimizer: {
          enabled: true,
          runs: 200
        }
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.4.24",
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
    // tokenOwner: 1,
    coordinator: {
      goerli: "0x2ca8e0c643bde4c2e08ab1fa0da3401adad7734d",
    },
  },
  networks: {
    goerli: {
      chainId: 5,
      url: goerliUrl,
      accounts: [privateKey],
      live: true,
      saveDeployments: true,
      tags: ["staging"],
    },

    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
};
