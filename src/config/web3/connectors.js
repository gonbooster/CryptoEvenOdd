import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const injected = new InjectedConnector({
  supportedChainIds: [137, 80001]
});

const walletconnect = new WalletConnectConnector({
  rpc: {
		//18: 'https://testnet-rpc.thundercore.com',
		//108: 'https://mainnet-rpc.thundercore.com',
		137: 'https://matic-mainnet.chainstacklabs.com',
		80001: 'https://rpc-mumbai.maticvigil.com'
	},
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
	pollingInterval: 15000
});

const walletlink = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/17a28e54d1824c4680e8c07d601b8005`,
	appName: 'demo-app',
	supportedChainIds: [137, 80001 ]
});

export function resetWalletConnector() {
	try{
		walletconnect.walletConnectProvider = undefined;
	} catch (error) {
    	console.log(error);
    }
}

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
  coinbaseWallet: walletlink
};
