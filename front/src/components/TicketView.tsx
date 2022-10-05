import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useShuffleOne } from "../hooks/useShuffleOne";

import { ethers } from "ethers"
import { useWeb3Context } from "../context/Web3";

type Props = {}

const TicketView = ({}: Props) => {
  const [ web3 ] = useWeb3Context();
  const shuffleOne = useShuffleOne();

  const [ canBuy, setCanBuy ] = useState(false);
  const [ buyTransaction, setBuyTransaction ] = useState();

  useEffect(() => {
    (async()=>{
      const isOpen = await shuffleOne.isRaffleOpen();
      const maxPerAddress = await shuffleOne.MAX_PER_ADDRESS();
      const ticketsBough = await shuffleOne.participants(web3.wallet);
    
      if (!isOpen && (maxPerAddress.gt(ticketsBough.ownedTickets))) {
        setCanBuy(true);
      } else {
        setCanBuy(false);
      }
    })();
  }, [ buyTransaction ] );

  const BuyTicket = () => {
    // todo check if user bough ticket;
    const buyTicketHandle = async () => {
      try {
        const response = await shuffleOne.buyTicket({ value: ethers.utils.parseEther("0.2") });
        const receipt = await response.wait();
        setBuyTransaction(receipt);
        console.log(receipt);
      } catch (e) {
        console.log(e);
      }
    };
  
    return (
      <>
       <Button onClick={() => { buyTicketHandle() }}> Buy ticket </Button>
      </>
    );
  };

  if (canBuy) {
   return <BuyTicket /> 
  } else {
    return 'Mint token'
  }
};

export { TicketView };