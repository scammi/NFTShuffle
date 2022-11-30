import {
  networkConfig,
  RAFFLE_FINALIZATION_BLOCKNUMBER
} from "../helper-hardhat-config"

import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployFunc = async function(hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts, ethers, network, getChainId } = hre;
  const {deploy} = deployments;

  const {deployer, admin, coordinator} = await getNamedAccounts();
  

  const chainId = await getChainId()
    
  let vrfCoordinatorAddress = coordinator
  
  let subscriptionId

  if (chainId == "31337") {
    const VRFCoordinatorV2MockDeployment = await deployments.get('VRFCoordinatorV2Mock')
    vrfCoordinatorAddress = VRFCoordinatorV2MockDeployment.address
    const VRFCoordinatorV2Mock = await ethers.getContractAt(VRFCoordinatorV2MockDeployment.abi, VRFCoordinatorV2MockDeployment.address)
    const fundAmount = networkConfig[chainId]["fundAmount"]
    const transaction = await VRFCoordinatorV2Mock.createSubscription()
    const transactionReceipt = await transaction.wait(1)
    subscriptionId = ethers.BigNumber.from(transactionReceipt.events[0].topics[1])
    await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, fundAmount)
  } else {
    // 2125 
    subscriptionId = process.env.VRF_SUBSCRIPTION_ID
    vrfCoordinatorAddress = networkConfig[chainId]["vrfCoordinator"]
  }

  await deploy('ShuffleOne', {
    from: deployer,
    args: [
      vrfCoordinatorAddress,
      networkConfig[chainId].keyHash,
      subscriptionId,
      5, // max supply
      ethers.utils.parseEther("0.1"),
      RAFFLE_FINALIZATION_BLOCKNUMBER // BIDDING_BLOCKS_LENGTH
    ],
    log: true,
  });
};

deployFunc.tags = ["ShuffleOne"]
module.exports =  deployFunc