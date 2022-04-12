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
import { CHAINS } from "../utils/constants";

const Home = () => {
  const {account, chainId, active} = useWeb3React();
  const [betCost, setBetCost] = useState(0);
  const [evenCount, setEvenCount] = useState(0);
  const [oddCount, setOddCount] = useState(0);
  const [price, setPrice] = useState(null);
  const [tokenSymbol, setTokenSymbol] = useState('');
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
    if(chainId){
      setTokenSymbol(CHAINS[chainId].symbol)
      fetch("https://api.coingecko.com/api/v3/simple/price?ids="+CHAINS[chainId].id+"&vs_currencies="+t('badge'))
      .then((res) => res.json())
      .then((data) => {      
        setPrice(data[CHAINS[chainId].id][t('badge')]);       
      })
      .catch((error) => {
        console.log(error);
      });
    } 
  }, [chainId]);


  useEffect(() => {
    getContractData();
  }, [ active]);
const eventName = 'Resolve';
const EventToast = function(_title, _message, _status) {
  const title = _title;
  const message = _message;
  const status = _status;
  return { title, message, status };
};
const losse = EventToast('losse_bet_title', 'losse_bet_title','error');
const win = EventToast('winner_bet_title', 'winner_bet_body','success');
const draw = EventToast('draw_bet_title', 'draw_bet_body','warning');
const types = [losse,win,draw];

const handler =  (address, r, a) => {
  console.log('a')
    let award = ethers.utils.formatEther(a); 
    getContractData();
    toast({
      title: t(types[r].title),
      description: t(types[r].message, award) + tokenSymbol,
      status: t(types[r].status),
    });
  }


  useEffect(() => {
    if(contract)
    {
      let filter = contract.filters.Resolve(account)
      contract.once(filter, handler)

      return () => {
        contract.removeListener(filter, handler)
       }
    } 
  }, [contract])
  
  const makeBetBtn = async() => {

    try {
      const overrides = {
        from: account,
        value: betCost
      };
      setIsBetting(true);
      await contract.callStatic.makeBet(Number(value), overrides); // si no usamos esto, no sabremos si existe un error por require en el smart contract
      let transaction = await contract.makeBet(Number(value), overrides);
      await transaction.wait().then(() =>{
        setIsBetting(false);
        toast({
          title: t('sended_bet_title'),
          description: t('sended_bet_body'),
          status: "info",
        });
        
      });

		} catch (ex) {
      setIsBetting(false);
      console.log(JSON.stringify(ex))
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
          description: JSON.stringify(ex),
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
              <Image src={process.env.PUBLIC_URL + '/images/even.jpg'} style={{width: 200, height: 200}}></Image>
              <Text align={'center'} >
            {t('even')}</Text>
              </Radio>
              <Radio value='1' padding={10}>
              <Image src={process.env.PUBLIC_URL + '/images/odd.jpg'} style={{width: 200, height: 200}}></Image>
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
            <Text> {t('bet_btn')} <strong>{ethers.utils.formatEther(betCost)}{tokenSymbol} ({(price * ethers.utils.formatEther(betCost)).toFixed(2)}{t('badge_symbol')})</strong>  {t('by')} <strong>{value == 1 ? t('odd') : t('even')}</strong>  </Text>
            </Button>
          </Stack>
                
      </Stack>
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading>{t('instructions')}</Heading>
          <Text>{t('instructions_step_0')}<a target="_blank" href={ CHAINS[137].metamask_tutorial}><Image style={{width: 150, height: 60}} src={ CHAINS[137].network_image_url}></Image></a></Text>
          <Text>{t('instructions_step_1')}<a target="_blank" href="https://chain.link/chainlink-vrf"><Image style={{width: 180, height:50}} src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chainlink_Logo_Blue.svg/512px-Chainlink_Logo_Blue.svg.png?20210226190931" ></Image></a></Text>
          <Text>{t('instructions_step_2')} <strong>{ethers.utils.formatEther(betCost) * 2 * 0.98}</strong> {tokenSymbol} ({(price * ethers.utils.formatEther(betCost)  * 2 * 0.98).toFixed(2)}{t('badge_symbol')})</Text>
          <Text>{t('instructions_step_3')} <strong>{ethers.utils.formatEther(betCost) * 0.98}</strong> {tokenSymbol} ({(price * ethers.utils.formatEther(betCost) * 0.98).toFixed(2)}{t('badge_symbol')})</Text>
          <Text>{t('instructions_step_4')} </Text>
          <Text color={'red'}>{t('instructions_step_5')}</Text>

      </Stack>
    </Stack>
  );
};

export default Home;
