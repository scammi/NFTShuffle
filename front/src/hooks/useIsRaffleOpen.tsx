import React, { useEffect, useState } from "react";
import { useShuffleOne } from "./useShuffleOne";

const useIsRaffleOpen = () => {
  const shuffleOne = useShuffleOne();

  const [ isRaffleOpen, setIsRaffleOpen ] = useState(false);

  useEffect(() => {
    (async()=>{
      const isOpen = await shuffleOne.isRaffleOpen();
      setIsRaffleOpen(!isOpen);
    })();
  },[]);

  return isRaffleOpen;
};

export { useIsRaffleOpen };