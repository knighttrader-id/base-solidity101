import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { CoinbaseWalletProvider } from "@coinbase/wallet-sdk";

declare global {
  interface Window {
    ethereum?: EthereumProvider | CoinbaseWalletProvider;
  }
}