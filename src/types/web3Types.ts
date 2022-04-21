import { ethers } from "ethers";

export interface Web3ContextInterface {
  provider: ethers.providers.Web3Provider | null;
  connectWallet: () => Promise<void>;
}