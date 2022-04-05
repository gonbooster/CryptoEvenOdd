import Web3 from "web3";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';



const connector = new InjectedConnector({
  supportedChainIds: [
    137,//Polygon
  ],
});

const walletconnect = new WalletConnectConnector({
	rpc: {
    137: 'https://polygon-rcp.com/',
	},
	bridge: "https://bridge.walletconnect.org"
});

const getLibrary = (provider) => {
  return new Web3(provider);
};

export { connector, walletconnect, getLibrary };
