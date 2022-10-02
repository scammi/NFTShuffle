import React from "react";
import { useWeb3Context } from "../context/Web3";
import { useShuffleOne } from "./useShuffleOne";

const useIsRaffleOpen = async () => {
  const [ web3 ] = useWeb3Context();

  const shuffleOne = useShuffleOne(web3.chainId);

  const isOpen = await shuffleOne.AVAILABLE_SUPPLY();
  console.log(isOpen);

  return shuffleOne;
};

export { useIsRaffleOpen };