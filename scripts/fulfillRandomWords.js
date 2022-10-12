const { ethers } = require("hardhat");

// RUN 
// npx hardhat run --network localhost scripts/fulfillRandomWords.js

(async () => {
  const shuffleOne = await ethers.getContract("ShuffleOne")
  const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")

  const shuffleOneAddress =  shuffleOne.address;
  const requestId = await shuffleOne.getRequestId();

  console.log(requestId, shuffleOneAddress);

  const fulfillRandomWordsTx = await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, shuffleOneAddress);
  const fulfillRandomWordsReceipt = await fulfillRandomWordsTx.wait()

  console.log(fulfillRandomWordsReceipt);
})();