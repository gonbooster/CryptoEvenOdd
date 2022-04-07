import {
  Flex,
  useDisclosure,
  Button,
  Tag,
  TagLabel,
  Badge,
  TagCloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { connectors, resetWalletConnector } from "../config/web3/connectors";
import { useCallback, useEffect, useState } from "react";
import useTruncatedAddress from "../hooks/useTruncateAddress";
import { useTranslation } from 'react-i18next';
import SelectWalletModal from "./modal";

const WalletData = () => {
  const [balance, setBalance] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    library,
    chainId,
    account,
    activate,
    deactivate,
    error,
    active
  } = useWeb3React();
  const { t } = useTranslation();

  const isUnsupportedChain = error instanceof UnsupportedChainIdError;

  const disconnect = () => {
    window.localStorage.setItem("provider", undefined);
    deactivate();
  };


  const getBalance = useCallback(async () => {
    const toSet = await library.provider.request({
      method: "eth_getBalance",
      params: [account,'latest']
    });
    setBalance((toSet / 1e18).toFixed(4));
  }, [library?.provider, account]);

  useEffect(() => {
    if (active) getBalance();
  }, [active, getBalance]);


  useEffect(async () => {
    
    const providerText = window.localStorage.getItem("provider");
    if (providerText == 'injected'){
			await activate(connectors[providerText]);
    } 
    else if(providerText == 'walletconnect'){
			resetWalletConnector(connectors[providerText]);
			await activate(connectors[providerText]);
    }
  }, []);
  
  const truncatedAddress = useTruncatedAddress(account);

  return (
    <>
      <Flex alignItems={"center"}>
        {active ? (
          <Tag colorScheme="green" borderRadius="full">
            <TagLabel>
              {truncatedAddress}
            </TagLabel>
            <Badge
              d={{
                base: "none",
                md: "block",
              }}
              variant="solid"
              fontSize="0.8rem"
              ml={1}
            >
              {balance} Ξ
            </Badge>
            <TagCloseButton onClick={disconnect} />
          </Tag>
        ) : (
          <Button
            variant={"solid"}
            colorScheme={"green"}
            size={"sm"}
            leftIcon={<AddIcon />}
            onClick={onOpen}
            disabled={isUnsupportedChain}
          >
            {isUnsupportedChain ? t('network_not_supported') : t('connect_metamask')}
          </Button>
        )}
      </Flex>
      <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
    </>
  );
};

export default WalletData;
