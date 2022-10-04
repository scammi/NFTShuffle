import React from "react";
import { useIsRaffleOpen } from "../hooks/useIsRaffleOpen"
import { Button } from "@mui/material";
import { useShuffleOne } from "../hooks/useShuffleOne";

import { ethers } from "ethers"

type Props = {}

const BuyTicket = () => {
  const shuffleOne = useShuffleOne();

  // todo check if user bough ticket;
  const buyTicketHandle = async () => {
    const response = await shuffleOne.buyTicket({ value: ethers.utils.parseEther("0.2") });
    const receipt = await response.wait();
    console.log(receipt);
  };

  return (
    <>
     <Button onClick={() => { buyTicketHandle() }}> Buy ticket </Button>
    </>
  );
};

const TicketView = ({}: Props) => {
  const isOpen = useIsRaffleOpen();

  if (isOpen) {
   return <BuyTicket /> 
  } else {
    return 'Mint token'
  }
};

export { TicketView };