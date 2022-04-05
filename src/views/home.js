import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  RadioGroup,
  Radio,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import useContract from "../hooks/useContract";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

const Home = () => {
  const {account, library } = useWeb3React();
  const [betCost, setBetCost] = useState(0);
  const [evenCount, setEvenCount] = useState(0);
  const [oddCount, setOddCount] = useState(0);
  const [value, setValue] = useState('0');
  const [isBetting, setIsBetting] = useState(false);
  const contract = useContract();
  const toast = useToast();
  const { t  } = useTranslation();
 

  const getContractData = useCallback(async () => {
    if (contract) {
      const betCost = await contract.methods.betCost().call();
      const evenCount = await contract.methods.evenCount().call();
      const oddCount = await contract.methods.oddCount().call();
      if(Number(oddCount)+Number(evenCount) == 0){
        setEvenCount(Number(1));
        setOddCount(Number(1));
      }
      else{
        setEvenCount(Number(evenCount));
        setOddCount(Number(oddCount));
      }
      setBetCost(betCost);
    }
  }, [contract, account]);

  useEffect(() => {
    getContractData();
  }, [isBetting]);

  getContractData();
  
  const makeBetBtn = async() => {
    
    setIsBetting(true);
    await contract.methods
    .makeBet(Number(value))
    .send({
      from: account,
      value: betCost
    })
    .on("transactionHash", (txHash) => {
      toast({
        title: t('sending_bet_title'),
        description: t('sending_bet_body'),
        status: "info",
      });
    })
    .on("receipt", (receipt) => {
      setIsBetting(false);
      console.log(receipt)
      if(receipt.events.Winner){
        
        const returnValues = receipt.events.Winner.returnValues;
        const result = receipt.events.Winner.returnValues.result;
        toast({
          title: t(result == 2 ? 'winner_bet_title' : (result == 1 ? 'losse_bet_title' : 'draw_bet_title')),
          description: result == 2 ? t('winner_bet_body', {value: library.utils.fromWei(returnValues.award, "ether")}) : (result == 1 ? 'lose_bet_body' : 'draw_bet_body', {value: library.utils.fromWei(returnValues.award, "ether")})+t('tokens'),
          status: result == 2 ? "success" :(result == 1 ?  "error" : "warning"),
        });
      }
      else{
        toast({
          title: t('sended_bet_title'),
          description: t('sended_bet_body'),
          status: "info",
        });
      }
    })
    .on("error", (error) => {
      setIsBetting(false);
      toast({
        title: t('sended_bet_error_title'),
        description: t('sended_bet_error_body'),
        status: "error",
      });
    });
  };
  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: "column-reverse", md: "row" }}
    >

      <Stack flex={3} spacing={{ base: 5, md: 10 }}>
        <Text align={'center'} >
              <strong> {t('statistics',{even: (evenCount * 100) /(evenCount+oddCount), odd: (oddCount * 100) /(evenCount+oddCount)})} </strong>
        </Text>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          
          <Text align={'center'} >
            {t('bet_header')}
          </Text>
          <br />
          
        </Heading>
  
        <Stack
              align={'center'} 
          >
            <RadioGroup onChange={setValue} value={value}>
              <Radio value='0' padding={10}>
              <Image src="./images/even.jpg" style={{width: 200, height: 200}}></Image>
              <Text align={'center'} >
            {t('even')}</Text>
              </Radio>
              <Radio value='1' padding={10}>
              <Image src="./images/odd.jpg" style={{width: 200, height: 200}}></Image>
              <Text align={'center'} >
            {t('odd')}</Text>
              </Radio>
            </RadioGroup>  
          </Stack>
                  
          <Stack
              align={'center'} 
          >
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"green"}
              bg={"green.400"}
              _hover={{ bg: "green.500" }}
              disabled={!contract || isBetting}
              onClick={makeBetBtn}
              isLoading={isBetting}
            >
            <Text> {t('bet_btn')} <strong>{betCost/1000000000000000000}</strong> {t('tokens')} {t('by')} <strong>{value == 1 ? t('odd') : t('even')}</strong>  </Text>
            </Button>
          </Stack>
                
      </Stack>
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading>{t('instructions')}</Heading>
          <Text>{t('instructions_step_1')} </Text>
          <Text>{t('instructions_step_2')} <strong>{((betCost * 2) * 98/100)/1000000000000000000}</strong> {t('tokens')}</Text>
          <Text>{t('instructions_step_3')} <strong>{((betCost) * 98/100)/1000000000000000000}</strong> {t('tokens')}</Text>
          <Text>{t('instructions_step_4')} </Text>
          <Text color={'red'}>{t('instructions_step_5')} <strong>{((betCost * 2) * 1/100)/1000000000000000000}</strong> {t('tokens')} {t('instructions_step_5_2')}</Text>

      </Stack>
    </Stack>
  );
};

export default Home;
