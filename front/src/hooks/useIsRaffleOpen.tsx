import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../context/Web3";
import { useShuffleOne } from "./useShuffleOne";

// todo rename to can buy
const useIsRaffleOpen = () => {
  const [ web3 ] = useWeb3Context();
  const shuffleOne = useShuffleOne();
  const [ canBuy, setCanBuy ] = useState(false);

  useEffect(() => {
    (async()=>{
      const isOpen = await shuffleOne.isRaffleOpen();
      const maxPerAddress = await shuffleOne.MAX_PER_ADDRESS();
      const ticketsBough = await shuffleOne.participants(web3.wallet);

      console.log(!isOpen, ticketsBough.ownedTickets,maxPerAddress, maxPerAddress.gte(ticketsBough.ownedTickets));

      if (!isOpen && (maxPerAddress.gt(ticketsBough.ownedTickets))) {
        setCanBuy(true);
      } else {
        setCanBuy(false);
      }
    })();
  },[]);

  return canBuy;
};

export { useIsRaffleOpen };