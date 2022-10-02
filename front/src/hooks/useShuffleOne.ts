import React from "react";
import { Contract } from "ethers";
import { GLOBALS } from "../utils/globals";
import shuffleOne from "../../../deployments/localhost/ShuffleOne.json";

import { useWeb3Context } from "../context/Web3";

const useShuffleOne = () => {
  const [ web3 ] = useWeb3Context();

  const chainId = web3.chainId == 1337 ? 31337 : web3.chainId ;
  const shuffleOneAddress = GLOBALS.CONTRACT_ADDRESSES.shuffleOne[chainId];

  const provider = web3.writeProvider ? web3.writeProvider.getSigner() : web3.readProvider;
  const contract = new Contract(shuffleOneAddress, shuffleOne.abi, provider);

  console.log(contract, web3.writeProvider);

  return contract;
};

export { useShuffleOne };