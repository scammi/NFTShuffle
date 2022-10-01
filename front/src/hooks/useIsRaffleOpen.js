import { Contract } from "ethers";
import shuffleOne from "../../../deployments/localhost/ShuffleOne.json";

const useIsRaffleOpen = () => {
  const contract = new Contract(shuffleOne.address, shuffleOne.abi);


};

export { useIsRaffleOpen };