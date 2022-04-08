import {
    VStack,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Text
  } from "@chakra-ui/react";
  import { Image } from "@chakra-ui/react";
  import { useWeb3React } from "@web3-react/core";
  import { connectors, resetWalletConnector } from "../config/web3/connectors";
  
  export default function SelectWalletModal({ isOpen, closeModal }) {
    const { activate, deactivate } = useWeb3React();

    const connect = async (connector,type) => {

      await activate(connector, async (error) => {
        console.log(error); 
      });
      window.localStorage.setItem("provider", type);
      closeModal();
    };

    const test =(error) => {

      console.log(error)

    }
  
    return (
      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent w="300px">
          <ModalHeader>Select Wallet</ModalHeader>
          <ModalCloseButton
            _focus={{
              boxShadow: "none"
            }}
          />
          <ModalBody paddingBottom="1.5rem">
            <VStack>
              <Button
                variant="outline"
                onClick={() => {connect(connectors.walletConnect,"walletConnect")
                }}
                w="100%"
              >
                <HStack w="100%" justifyContent="center">
                  <Image
                    src="./images/wc.png"
                    alt="Wallet Connect Logo"
                    width={26}
                    height={26}
                    borderRadius="3px"
                  />
                  <Text>Wallet Connect</Text>
                </HStack>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  connect(connectors.injected, "injected");
                }}
                w="100%"
              >
                <HStack w="100%" justifyContent="center">
                  <Image
                    src="./images/mm.png"
                    alt="Metamask Logo"
                    width={25}
                    height={25}
                    borderRadius="3px"
                  />
                  <Text>Metamask</Text>
                </HStack>
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  