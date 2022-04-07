import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import artifact from "../config/web3/contract";
import { Contract } from '@ethersproject/contracts';
const { address, abi } = artifact;

const useContract = () => {
  const { active, account, library, chainId } = useWeb3React();

  const contract = useMemo(() => {
   
    if (active){
      const signer = library.getSigner(account).connectUnchecked();
      return new Contract(address[chainId], abi, signer);
    } 
  }, [active, chainId, library, account]);

  return contract;
};


export default useContract;
