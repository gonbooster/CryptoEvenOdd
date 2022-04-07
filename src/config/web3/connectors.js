import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 137]
});

const walletconnect = new WalletConnectConnector({
  rpc: {
		1: 'https://mainnet.infura.io/v3/17a28e54d1824c4680e8c07d601b8005',
		4: 'https://rinkeby.infura.io/v3/17a28e54d1824c4680e8c07d601b8005',
		137: 'https://matic-mainnet.chainstacklabs.com',
	},
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
	pollingInterval: 15000
});

const walletlink = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/17a28e54d1824c4680e8c07d601b8005`,
	appName: 'demo-app',
	supportedChainIds: [ 1, 4 ]
});

export function resetWalletConnector(connector) {
	if (connector && connector instanceof WalletConnectConnector) {
		connector.walletConnectProvider = undefined;
	}
}

export const connectors = {
  injected: injected,
  walletConnect: walletconnect,
  coinbaseWallet: walletlink
};
