const { ethers } = require("hardhat");

(async () => {
  // await deployments.fixture(["ShuffleOne"]);
  // const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
  // console.log(vrfCoordinatorV2Mock);

  const shuffleOne = await ethers.getContract("ShuffleOne")
  const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")

  const shuffleOneAddress =  shuffleOne.address;
  const requestId = await shuffleOne.getRequestId();

  console.log(requestId, shuffleOneAddress);

  const fulfillRandomWordsTx = await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, shuffleOneAddress);
  const fulfillRandomWordsReceipt = await fulfillRandomWordsTx.wait()

  console.log(fulfillRandomWordsReceipt);
})();