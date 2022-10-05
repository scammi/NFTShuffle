import React from "react";
import { useIsRaffleOpen } from "../hooks/useIsRaffleOpen"
import { Button } from "@mui/material";
import { useShuffleOne } from "../hooks/useShuffleOne";

import { ethers } from "ethers"

type Props = {}

const TicketView = ({}: Props) => {
  const isOpen = useIsRaffleOpen();

  const BuyTicket = () => {
    const shuffleOne = useShuffleOne();
    
    // todo check if user bough ticket;
    const buyTicketHandle = async () => {
      try {
        const response = await shuffleOne.buyTicket({ value: ethers.utils.parseEther("0.2") });
        const receipt = await response.wait();
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

  if (isOpen) {
   return <BuyTicket /> 
  } else {
    return 'Mint token'
  }
};

export { TicketView };