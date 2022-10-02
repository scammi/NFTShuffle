import React from "react";
import { useIsRaffleOpen } from "../hooks/useIsRaffleOpen"
import { Button } from "@mui/material";
import { useShuffleOne } from "../hooks/useShuffleOne";
import { useWeb3Context } from "../context/Web3";

type Props = {}

const BuyTicket = () => {
  const [ web3 ] = useWeb3Context();
  const shuffleOne = useShuffleOne(web3.chainId);

  // todo check if user bough ticket;
  const buyTicketHandle = async () => {
    const response = await shuffleOne.buyTicket();
    console.log(response);
  };

  return (
    <>
     <Button onClick={() => { buyTicketHandle() }}> Buy ticket </Button>
    </>
  );
};

const TicketView = ({}: Props) => {
  const isOpen = useIsRaffleOpen();

  // return `Ticket View : )  ${isOpen ? 'Ruffle is open' : 'Raffle is closed' }`;

  if (isOpen) {
   return <BuyTicket /> 
  } else {
    return 'Mint token'
  }
};

export { TicketView };