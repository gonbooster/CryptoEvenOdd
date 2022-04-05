import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import useContract from "../hooks/useContract";
import { useCallback, useEffect, useState } from "react";

const Admin = () => {;
  const { active, account, library } = useWeb3React();
  const contract = useContract();


  const setBetCost = () => {
    
    const cost = prompt("Ingresa el costo en ethers: ");
    if(!cost){
      return false;
    }
    contract.methods
    .setBetCost(library.utils.toWei(cost, "ether"))
      .send({
        from: account,
      })
      .on("transactionHash", (txHash) => {
        console.log(txHash)
      })
      .on("receipt", () => {
        console.log("ok")
      })
      .on("error", (error) => {
        console.log(error.message)
      });
  };
  

  return (
    <Stack
    >  
          <Button onClick={setBetCost}> Cambiar coste de las apuestas </Button>

    </Stack>
  );
};

export default Admin;
