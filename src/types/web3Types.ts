import { ethers } from "ethers";

export interface Web3ContextInterface {
  provider: ethers.providers.Web3Provider | null;
  connectWallet: () => Promise<void>;
}

export interface NFT {
  tokenId: string
  price: number
  jpycPrice: number
  image: string
  name: string
}