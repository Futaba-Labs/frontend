import 'dotenv/config'
import { BigNumber, ethers } from 'ethers'
import { arthswap } from './arthswap'
import { uniswap } from './uniswap'
import { estimateFee } from './estimateFee'
import { bridge, checkBridgeStatus } from './bridge'
import ERC20ABI from './abis/abi.json'
import { GetTransferStatusRequest } from '../ts-proto/gateway/gateway_pb'
import { WebClient } from '../ts-proto/gateway/GatewayServiceClientPb'

global.XMLHttpRequest = require('xhr2')
require('dotenv').config()

const randomWallet = ethers.Wallet.createRandom()
const privateKey = randomWallet.privateKey
const astarProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_ASTAR_URL ?? '')
const walletWithAstarProvider = new ethers.Wallet(privateKey, astarProvider)

console.log(process.env.NEXT_PUBLIC_ASTAR_URL)


interface Window {
  ethereum?: import('ethers').providers.ExternalProvider;
}


export class EasyDex {
  web3Provider: ethers.providers.Web3Provider
  walletAddress: string
  signer: ethers.Signer
  currentAmount: BigNumber = BigNumber.from('0')
  currentAmountNumber: number
  estimateAmountByBridge: number
  maxSlipage: number
  token0Contract: ethers.Contract
  currentSwappedAmount: BigNumber = BigNumber.from('0')
  transferId = ''

  constructor(web3Provider: ethers.providers.Web3Provider, amountIn: number, walletAddress: string) {
    this.web3Provider = web3Provider
    this.signer = web3Provider.getSigner();
    this.currentAmountNumber = amountIn
    this.estimateAmountByBridge = 0
    this.maxSlipage = 0;
    this.walletAddress = walletAddress

    this.token0Contract = new ethers.Contract(
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      ERC20ABI,
      this.signer,
    )
  }

  getEstimateFee = async (): Promise<[number, number, number, number, number, number, number]> => {
    const [maticGasFee, bridgeFee, bridgeRate, amountOut, maxSlipage, estimateAmt, estimateGasPrice] = await estimateFee(this.currentAmountNumber, this.web3Provider, walletWithAstarProvider)
    this.maxSlipage = maxSlipage
    this.estimateAmountByBridge = estimateAmt
    return [maticGasFee, bridgeFee, bridgeRate, amountOut, maxSlipage, estimateAmt, estimateGasPrice]
  }

  swapByUniswap = async (): Promise<ethers.providers.TransactionResponse | null> => {
    this.currentSwappedAmount = await this.currentBalance()
    const transaction = await uniswap(this.web3Provider, this.currentAmountNumber)
    if (!transaction) return null
    console.log('Swapping...')
    return transaction
  }

  completeSwap = async () => {
    const balance = await this.currentBalance()
    const transferredAmount = balance.sub(this.currentSwappedAmount)
    this.currentAmount = transferredAmount
  }

  // polygon側でのブリッジの送信(return tx)
  bridge = async (): Promise<ethers.providers.TransactionResponse | null> => {
    const [maticGasFee, bridgeFee, bridgeRate, amountOut, maxSlipage, estimateAmt, estimateGasPrice] = await estimateFee(this.currentAmountNumber, this.web3Provider, walletWithAstarProvider)
    const [transaction, transferId] = await bridge(this.web3Provider, this.currentAmount, maxSlipage)
    if (!transaction) return null
    this.transferId = transferId
    return transaction
  }

  // 送信完了・ブリッジ完了待機
  waitBridge = async (): Promise<boolean> => {
    const request = new GetTransferStatusRequest()
    request.setTransferId(this.transferId)
    const client = new WebClient(`https://cbridge-prod2.celer.network`, null, null)

    const result = await checkBridgeStatus(client, request)

    return result
  }

  // トランザクション完了まで
  swapByArthswap = async () => {
    const transaction = await arthswap(this.web3Provider, ethers.utils.parseUnits((this.estimateAmountByBridge).toString(), 6))
    return transaction
  }

  switchNetwork = async () => {
    const w = window as Window
    try {
      if (w.ethereum !== undefined) {
        await
          w.ethereum.request!({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x250',
              rpcUrls: ['https://astar.api.onfinality.io/public'],
              chainName: 'Astar Network',
              nativeCurrency: {
                name: 'ASTR',
                symbol: 'ASTR',
                decimals: 18,
              },
              blockExplorerUrls: ['https://blockscout.com/astar/'],
            }],
          })
      }
    } catch (err) {
      console.log(err)
    }
  }

  setWeb3Provider = async (web3Provider: ethers.providers.Web3Provider) => {
    const currentNetwork = await this.web3Provider.getNetwork()
    const otherNetwork = await web3Provider.getNetwork()
    if (currentNetwork !== otherNetwork && otherNetwork.chainId === 592) {
      this.web3Provider = web3Provider
    }
  }

  currentBalance = async (): Promise<BigNumber> => {
    return await this.token0Contract.balanceOf(this.walletAddress)
  }
}


// export const swapAndBridge = async (web3Provider: ethers.providers.Web3Provider, amountIn: number): Promise<any> => {

//   const privateKey: string = process.env.PRIVATE_KEY ?? ""
//   const provider = new ethers.providers.JsonRpcProvider(process.env.ASTAR_URL)
//   const polygonProvider = new ethers.providers.JsonRpcProvider(process.env.ASTAR_URL)
//   let walletWithProvider = new ethers.Wallet(privateKey, polygonProvider);
//   let walletWithAstarProvider = new ethers.Wallet(privateKey, provider);

//   const [maticGasFee, bridgeFee, bridgeRate, amountOut, maxSlipage, estimateAmt, estimateGasPrice] = await estimateFee(amountIn, web3Provider, walletWithAstarProvider)

//   const uniswapAmount = await uniswap(polygonProvider, walletWithProvider, amountIn)
//   const [result, amount] = await bridge(walletWithProvider, uniswapAmount !== 0 ? uniswapAmount : BigNumber.from('0'), maxSlipage)
//   if (result) {
//     await arthswap(walletWithAstarProvider, ethers.utils.parseUnits((estimateAmt).toString(), 6))
//     console.log('Transaction Finished')
//   } else {
//     console.log('Bridge Error')
//   }
// }

// export const getEstimateFee = async (web3Provider: ethers.providers.Web3Provider, amount: number) => {
//   return await estimateFee(amount, web3Provider, walletWithAstarProvider)
// }
