
module.exports = async function (hre) {
  const {deployments, getNamedAccounts, ethers} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  await deploy('ShuffleOne', {
    from: deployer,
    args: [5, ethers.utils.parseEther("0.1")],
    log: true,
  });
};

module.exports.tags = ['ShuffleOne'];