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
  const [ canMint, setCanMint ] = useState(false);

  const [ buyTransaction, setBuyTransaction ] = useState();
  const [ mintTransaction, setMintTransaction ] = useState();
  const [ ticketsLeft, setTicketsLeft ] = useState(-1);

  useEffect(() => {
    (async()=>{
      const isOpen = await shuffleOne.isRaffleOpen();
      const maxPerAddress = await shuffleOne.MAX_PER_ADDRESS();
      const userTicket = await shuffleOne.participants(web3.wallet);

      // Can buy ?
     setCanBuy(!isOpen && (maxPerAddress.gt(userTicket.ownedTickets)));

      // Can mint ?
     setCanMint(isOpen && (userTicket.minted.lt(userTicket.ownedTickets)));

      // Ticket left
      const ticketsSold = await shuffleOne.getSoldTickets();
      const maxSupply = await shuffleOne.AVAILABLE_SUPPLY();
      setTicketsLeft(maxSupply.sub(ticketsSold).toString());
    })();
  }, [ buyTransaction, mintTransaction ] );

  const BuyTicketButton = () => {
    const buyTicketHandle = async () => {
      try {
        const response = await shuffleOne.buyTicket({ value: ethers.utils.parseEther("0.2") });
        const receipt = await response.wait();
        setBuyTransaction(receipt);
      } catch (e) {
        console.log(e);
      }
    };
    return (
     <Button onClick={() => { buyTicketHandle() }}> Buy ticket </Button>
    );
  };

  const MintTokenButton = () => {
    const mintTokenHandle = async () => {
      try {
        const response = await shuffleOne.mint();
        const receipt = await response.wait();
        setMintTransaction(receipt);
      } catch (e) {
        console.log(e);
      }
    };
    return (
     <Button onClick={() => { mintTokenHandle() }}> Mint token </Button>
    ); 
  };

  return (
    <>
      { (ticketsLeft > 0) ? `Tickets left ${ticketsLeft}` : 'Sold out! MINT !!!!' }
      <div>
      { canBuy && <BuyTicketButton /> || canMint && <MintTokenButton /> }
      </div>
      { (!canBuy && !canMint) && 'Please be patient and wait for the raffle to end to mint :)' }
    </> 
  );
};

export { TicketView };