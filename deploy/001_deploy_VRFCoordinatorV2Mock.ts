
import {getNamedAccounts, deployments, network} from "hardhat"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const DECIMALS = "18"
const INITIAL_PRICE = "200000000000000000000"

/**
 * @dev Read more at https://docs.chain.link/docs/chainlink-vrf/
 */
const BASE_FEE = "100000000000000000"
const GAS_PRICE_LINK = "1000000000" // 0.000000001 LINK per gas


const deployFunc = async({ getNamedAccounts, deployments, getChainId }: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = await getChainId()
  // If we are on a local development network, we need to deploy mocks!
  if (chainId == "31337") {

    log("Local network detected! Deploying mocks...")
    const linkToken = await deploy("LinkToken", { from: deployer, log: true })
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_PRICE],
    })
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: [
        BASE_FEE,
        GAS_PRICE_LINK
      ],
    })
    await deploy("MockOracle", {
      from: deployer,
      log: true,
      args: [linkToken.address],
    })
    log("Mocks Deployed!")
    log("----------------------------------------------------")
    log("You are deploying to a local network, you'll need a local network running to interact")
    log("Please run `yarn hardhat console` to interact with the deployed smart contracts!")
    log("----------------------------------------------------")
  }
}
deployFunc.tags = ["all", "mocks", "main"]
module.exports =  deployFunc