import { BigNumber, ethers } from 'ethers'
import { AlphaRouter, ChainId } from '@uniswap/smart-order-router'
import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core'
import { JSBI } from 'quickswap-sdk'
import ERC20ABI from './abis/abi.json'


const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'

export const uniswap = async (web3Provider: ethers.providers.Web3Provider, amountIn: number): Promise<ethers.providers.TransactionResponse | null> => {
  const router = new AlphaRouter({ chainId: ChainId.POLYGON, provider: web3Provider })
  const signer = web3Provider.getSigner()
  const walletAddress = await signer.getAddress()

  const token0Contract = new ethers.Contract(
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    ERC20ABI,
    signer,
  )

  const currentUSDCAmount: BigNumber = await token0Contract.balanceOf(walletAddress)

  const MATIC = new Token(
    ChainId.POLYGON,
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    18,
    'WMATIC',
    'Wrapped MATIC',
  )

  const USDC = new Token(
    ChainId.POLYGON,
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    6,
    'USDC',
    'USD//C',
  )
  const parsedAmountIn = ethers.utils.parseUnits(amountIn.toString())
  const maticAmout = CurrencyAmount.fromRawAmount(MATIC, JSBI.BigInt(parsedAmountIn))

  try {
    const route = await router.route(
      maticAmout,
      USDC,
      TradeType.EXACT_INPUT,
      {
        recipient: walletAddress,
        slippageTolerance: new Percent(3, 100),
        deadline: Math.floor(Date.now() / 1000 + 1800),
      },
    )

    if (route != null) {
      console.log(parseInt(ethers.utils.parseUnits((parseFloat(route?.quote.toFixed(6)) * 0.9).toFixed(6), 6)._hex))
      const transaction = {
        data: route?.methodParameters!.calldata,
        to: V3_SWAP_ROUTER_ADDRESS,
        value: parsedAmountIn,
        from: walletAddress,
        gasPrice: BigNumber.from(route.gasPriceWei).mul(10),
      }

      const tx = await signer.sendTransaction(transaction)
      return tx
    }
  } catch (e) {
    console.log(e)
  }
  return null
}
