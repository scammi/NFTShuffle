import React from "react";
import { useWeb3Context } from "../context/Web3";
import { useShuffleOne } from "./useShuffleOne";

const useIsRaffleOpen = () => {
  const [ web3 ] = useWeb3Context();

  const shuffleOne = useShuffleOne(web3.chainId);

  // const isOpen = await shuffleOne.isRaffleOpen();

  return shuffleOne;
};

export { useIsRaffleOpen };