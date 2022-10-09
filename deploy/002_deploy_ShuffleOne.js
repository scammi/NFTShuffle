const {
  networkConfig,
  RAFFLE_FINALIZATION_BLOCKNUMBER
} = require("../helper-hardhat-config")


module.exports = async function (hre) {
  const {deployments, getNamedAccounts, ethers, network} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  const chainId = network.config.chainId

  VRFCoordinatorV2MockDeployment = await deployments.get('VRFCoordinatorV2Mock')
  vrfCoordinatorAddress = VRFCoordinatorV2MockDeployment.address
  VRFCoordinatorV2Mock = await ethers.getContractAt(VRFCoordinatorV2MockDeployment.abi, VRFCoordinatorV2MockDeployment.address)

  if (chainId == 31337) {
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
      1,
      ethers.utils.parseEther("0.1"),
      RAFFLE_FINALIZATION_BLOCKNUMBER // BIDDING_BLOCKS_LENGTH
    ],
    log: true,
  });
};

module.exports.tags = ['ShuffleOne'];