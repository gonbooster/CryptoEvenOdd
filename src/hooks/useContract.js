import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import artifact from "../config/web3/artifact";

const { address, abi } = artifact;

const useContract = () => {
  const { active, library, chainId } = useWeb3React();

  const contract = useMemo(() => {
    if (active) return new library.eth.Contract(abi, address[chainId]);
  }, [active, chainId, library?.eth?.Contract]);

  return contract;
};

export default useContract;
