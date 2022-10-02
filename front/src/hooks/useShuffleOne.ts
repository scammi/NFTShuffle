import React from "react";
import { Contract } from "ethers";
import { GLOBALS } from "../utils/globals";
import shuffleOne from "../../../deployments/localhost/ShuffleOne.json";

import { useWeb3Context } from "../context/Web3";

const useShuffleOne = (chainId: number) => {
  const [ web3 ] = useWeb3Context();

  const shuffleOneAddress = GLOBALS.CONTRACT_ADDRESSES.shuffleOne[chainId];

  const contract = new Contract(shuffleOneAddress, shuffleOne.abi, web3.readProvider);
  console.log(contract);

  return contract;
};

export { useShuffleOne };