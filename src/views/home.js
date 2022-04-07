import { useCallback, useEffect, useState } from "react";
import {
  Stack,
  Heading,
  Text,
  Button,
  RadioGroup,
  Radio,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from 'react-i18next';
import useContract from "../hooks/useContract";
import { ethers } from "ethers";
import {isMobile} from 'react-device-detect';

const Home = () => {
  const {account, library} = useWeb3React();
  const [result, setResult] = useState(0);
  const [betCost, setBetCost] = useState(0);
  const [evenCount, setEvenCount] = useState(0);
  const [oddCount, setOddCount] = useState(0);
  const [value, setValue] = useState('0');
  const [isBetting, setIsBetting] = useState(false);
  const contract = useContract();
  const toast = useToast();
  const { t  } = useTranslation();


  const getContractData = async () => {
    if (contract) {
    
      const betCost = await contract.betCost();    
      const evenCount = await contract.evenCount();
      const oddCount = await contract.oddCount();
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
  };
  
  

  useEffect(() => {
    getContractData();
  }, [contract, account, result]);
  
  const makeBetBtn = async() => {

    try {
      const overrides = {
        gasLimit: 230000,
        from: account,
        value: betCost
      };
      setIsBetting(true);
      await contract.callStatic.makeBet(Number(value), overrides);
      let transaction = await contract.makeBet(Number(value), overrides);
      await transaction.wait().then((receipt) =>{
        setIsBetting(false);
        const winnerEvents = receipt.events.find(e => e.event == "Winner");
        if(winnerEvents){
          const result = winnerEvents.args.result;
          setResult(result)
          const award = winnerEvents.args.award;
          toast({
            title: t(result == 2 ? 'winner_bet_title' : (result == 1 ? 'losse_bet_title' : 'draw_bet_title')),
            description: result == 2 ? t('winner_bet_body', {value: ethers.BigNumber.from(award)})+t('tokens') : result == 1 ? t('lose_bet_body') : t('draw_bet_body', {value: ethers.BigNumber.from(award)})+t('tokens'),
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
        
      });

		} catch (ex) {
      setIsBetting(false);
      console.log(ex)
      if(ex.code == 4001){
        console.log(ex);
        toast({
          title: t('sended_bet_error_title'),
          description: t('sended_bet_error_body'),
          status: "error",
        });
      }
      else{
        toast({
          title: 'Error',
          description: String(ex),
          status: "error",
        });
      }
      
		}


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
              <strong> {t('statistics',{even: ((evenCount * 100) /(evenCount+oddCount)).toFixed(2), odd: ((oddCount * 100) /(evenCount+oddCount)).toFixed(2)})} </strong>
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
