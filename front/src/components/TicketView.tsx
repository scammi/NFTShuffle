import React from "react";
import { useIsRaffleOpen } from "../hooks/useIsRaffleOpen"

type Props = {}

const TicketView = ({}: Props) => {
  const isOpen = useIsRaffleOpen();

  console.log('is OPEN > ', isOpen);

  return 'Ticket View : )';
};


export { TicketView };