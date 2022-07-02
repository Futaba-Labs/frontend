import {TransactionStatus} from '@/types/utilTypes'
import {Web3ContextInterface} from '@/types/web3Types'
import {getWeb3Provider} from '@/utils/web3Util'
import {createContext, useEffect, useState} from 'react'
import {toast} from 'react-toastify'

type Interface = Web3ContextInterface;

interface Window {
  ethereum?: import('ethers').providers.ExternalProvider;
}

const getDefaultContextValue = (): Web3ContextInterface => ({
  transactionStatuses: [],
  provider: null,
  visible: false,
  setVisible: (visible: boolean) => {},
  connectWallet: async () => {},
  addTransactionStatus: (transactionStatus: TransactionStatus) => {},
})

export const NFTMarcketTransaction = createContext<Web3ContextInterface>(getDefaultContextValue())

export const TransactionProvider: React.FC<React.PropsWithChildren<{ key?: string }>> = ({children}) => {
  const [provider, setProvider] = useState<Interface['provider']>(null)
  const [transactionStatuses, setTransactionStatuses] = useState<TransactionStatus[]>([])
  const [visible, setVisible] = useState(false)

  const connectWallet = async () => {
    try {
      if (!provider) {
        const [instance, _provider] = await getWeb3Provider()
        setProvider(_provider)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const changeNetwork = async () => {
    if (provider != null) {
      const chainId = (await provider.getNetwork()).chainId
      if (chainId !== 137) {
        const w = window as Window
        try {
          if (w.ethereum !== undefined) {
            await w.ethereum.request!({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x89',
                rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
                chainName: 'Matic Mainnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://polygonscan.com/'],
              }],
            })
            await connectWallet()
            const afterChainId = (await provider.getNetwork()).chainId
            if (afterChainId !== 137) {
              toast.error('Unsupported Chain Id')
            }
          }
        } catch (err) {
          console.log(err)
        }
      }
    }
  }

  const addTransactionStatus = (transactionStatus: TransactionStatus) => {
    console.log(transactionStatuses)
    setTransactionStatuses([...transactionStatuses, transactionStatus])
  }

  useEffect(() => {
    connectWallet()
    // changeNetwork()
  })

  return (
    <NFTMarcketTransaction.Provider
      value={{
        provider,
        transactionStatuses,
        visible,
        setVisible,
        connectWallet,
        addTransactionStatus,
      }}
    >
      {children}
    </NFTMarcketTransaction.Provider>
  )
}
