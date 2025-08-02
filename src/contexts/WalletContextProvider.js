"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletContextProvider = void 0;
const react_1 = require("react");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const wallet_adapter_phantom_1 = require("@solana/wallet-adapter-phantom");
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const web3_js_1 = require("@solana/web3.js");
// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");
const WalletContextProvider = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = wallet_adapter_base_1.WalletAdapterNetwork.Devnet;
    // You can also provide a custom RPC endpoint.
    const endpoint = (0, react_1.useMemo)(() => (0, web3_js_1.clusterApiUrl)(network), [network]);
    const wallets = (0, react_1.useMemo)(() => [
        new wallet_adapter_phantom_1.PhantomWalletAdapter(),
    ], []);
    return (<wallet_adapter_react_1.ConnectionProvider endpoint={endpoint}>
      <wallet_adapter_react_1.WalletProvider wallets={wallets} autoConnect>
        <wallet_adapter_react_ui_1.WalletModalProvider>
          {children}
        </wallet_adapter_react_ui_1.WalletModalProvider>
      </wallet_adapter_react_1.WalletProvider>
    </wallet_adapter_react_1.ConnectionProvider>);
};
exports.WalletContextProvider = WalletContextProvider;
