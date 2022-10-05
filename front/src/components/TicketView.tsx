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

  useEffect(() => {
    (async()=>{
      const isOpen = await shuffleOne.isRaffleOpen();
      const maxPerAddress = await shuffleOne.MAX_PER_ADDRESS();
      const ticketsBough = await shuffleOne.participants(web3.wallet);

      // Can buy ?
      if (!isOpen && (maxPerAddress.gt(ticketsBough.ownedTickets))) { setCanBuy(true); }

      // Can mint ?
      if (isOpen && (ticketsBough.minted.lt(ticketsBough.ownedTickets))) { setCanMint(true) };
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

  if (canBuy) { return <BuyTicketButton /> }
  else if (canMint) { return  <MintTokenButton /> }
};

export { TicketView };