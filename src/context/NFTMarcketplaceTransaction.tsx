import { Web3ContextInterface } from "@/types/web3Types";
import { getWeb3Provider } from "@/utils/web3Util";
import { createContext, useState } from "react";

type Interface = Web3ContextInterface;

const getDefaultContextValue = (): Web3ContextInterface => ({
  provider: null,
  connectWallet: async () => {}
});

export const NFTMarcketTransaction = createContext<Web3ContextInterface>(getDefaultContextValue())

export const TransactionProvider: React.FC<React.PropsWithChildren<{ key?: string }>> = ({children}) => {
  const [provider, setProvider] = useState<Interface['provider']>(null);

  const connectWallet = async () => {
    try {
      if (!provider) {
        const [instance, _provider] = await getWeb3Provider();
        setProvider(_provider);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <NFTMarcketTransaction.Provider
      value={{
        provider,
        connectWallet,
      }}
    >
      {children}
    </NFTMarcketTransaction.Provider>
  );
}