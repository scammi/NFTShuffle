import React from "react";
import { Contract } from "ethers";
import { GLOBALS } from "../utils/globals";
import shuffleOne from "../../../deployments/localhost/ShuffleOne.json";

import { useWeb3Context } from "../context/Web3";

const useShuffleOne = () => {
  const [ web3 ] = useWeb3Context();

  const shuffleOneAddress = shuffleOne.address

  const provider = web3.writeProvider ? web3.writeProvider.getSigner() : web3.readProvider;
  const contract = new Contract(shuffleOneAddress, shuffleOne.abi, provider);

  return contract;
};

export { useShuffleOne };