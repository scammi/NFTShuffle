import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useShuffleOne } from "../hooks/useShuffleOne";

import { ethers } from "ethers"
import { useWeb3Context } from "../context/Web3";

type Props = {}

const TicketView = ({ }: Props) => {
  const [web3] = useWeb3Context();
  const shuffleOne = useShuffleOne();

  const [canBuy, setCanBuy] = useState(false);
  const [canMint, setCanMint] = useState(false);
  const [canRequestRandomness, setCanRequestRandomness] = useState(false);

  const [buyTransaction, setBuyTransaction] = useState();
  const [mintTransaction, setMintTransaction] = useState();
  const [randomnessTransaction, setRandomnessTransaction] = useState();
  const [ticketsLeft, setTicketsLeft] = useState(-1);

  useEffect(() => {
    (async () => {
      const isOpen = await shuffleOne.isRaffleOpen();
      const requestedRandomness = await shuffleOne.getRequestId();
      const entropy = await shuffleOne.entropy();
      const maxPerAddress = await shuffleOne.MAX_PER_ADDRESS();
      const userTicket = await shuffleOne.participants(web3.wallet);

      // Can buy ?
      setCanBuy(isOpen && (maxPerAddress.gt(userTicket.ownedTickets)));

      // Can mint ?
      setCanMint(
        !isOpen // Raffle is closed
        && userTicket.minted.lt(userTicket.ownedTickets) // User has nfts to mint
        && !requestedRandomness.isZero() // Randomness has not been 
        && !entropy.isZero() // Has entropy
      );

      // Can request randomness
      setCanRequestRandomness(requestedRandomness.isZero() && entropy.isZero())

      // Ticket left
      const ticketsSold = await shuffleOne.getSoldTickets();
      const maxSupply = await shuffleOne.AVAILABLE_SUPPLY();
      setTicketsLeft(maxSupply.sub(ticketsSold).toString());
    })();
  }, [buyTransaction, mintTransaction, randomnessTransaction, web3]);

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

  const RequestRandomnessButton = () => {
    const requestRandomnessHandle = async () => {
      try {
        const response = await shuffleOne.requestRandomness();
        const receipt = await response.wait();
        setRandomnessTransaction(receipt);
      } catch (e) {
        console.log(e);
      }
    };
    return (
      <Button onClick={() => { requestRandomnessHandle() }}> Request randomness </Button>
    );
  };

  return (
    <>
      {(ticketsLeft > 0) ? `Tickets left ${ticketsLeft}` : 'Sold out! MINT !!!!'}
      <div>
        {canBuy && <BuyTicketButton /> || canMint && <MintTokenButton /> || canRequestRandomness && <RequestRandomnessButton />}
      </div>
      {(!canBuy && !canMint) && 'Please be patient and wait for the raffle to end to mint :)'}
    </>
  );
};

export { TicketView };