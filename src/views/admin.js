import {
  Stack,
  Button,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import useContract from "../hooks/useContract";
import { ethers } from "ethers";

const Admin = () => {;
  const { active, account, library } = useWeb3React();
  const contract = useContract();


  const setBetCost = async() => {
    
    const cost = prompt("Ingresa el costo en ethers: ");
    if(!cost){
      return false;
    }
    try {
      const overrides = {
        gasLimit: 230000,
        from: account,
      };
      const transaction = await contract
      .setBetCost(ethers.BigNumber.from(cost),overrides);
    } catch (ex) {
      console.log(ex);
    }    
  };
  

  return (
    <Stack
    >  
          <Button onClick={setBetCost}> Cambiar coste de las apuestas </Button>

    </Stack>
  );
};

export default Admin;
