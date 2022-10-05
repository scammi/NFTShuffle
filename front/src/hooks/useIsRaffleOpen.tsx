import { Transaction } from "ethers";
import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../context/Web3";
import { useShuffleOne } from "./useShuffleOne";

type Props = { 
  update?: Transaction
}
// todo rename to can buy
const useIsRaffleOpen = (Props: Props ) => {
  const [ web3 ] = useWeb3Context();
  const shuffleOne = useShuffleOne();
  const [ canBuy, setCanBuy ] = useState(false);

  useEffect(() => {

  }, [ Props.update ]);

  return canBuy;
};

export { useIsRaffleOpen };