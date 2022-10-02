import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../context/Web3";
import { useShuffleOne } from "./useShuffleOne";

const useIsRaffleOpen = () => {
  const [ web3 ] = useWeb3Context();
  const shuffleOne = useShuffleOne(web3.chainId);

  const [ isRaffleOpen, setIsRaffleOpen ] = useState();

  useEffect(() => {
    (async()=>{
      const isOpen = await shuffleOne.isRaffleOpen();

      setIsRaffleOpen(isOpen);
    })();
  },[]);

  console.log(isRaffleOpen);
  return isRaffleOpen;
};

export { useIsRaffleOpen };