import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core'
import { AlphaRouter, ChainId } from '@uniswap/smart-order-router'
import { BigNumber, ethers } from 'ethers'
import { JSBI } from 'quickswap-sdk'
import { abi as AstarSwapRouterABI } from './abis/AstarSwapRouter.json'
import { WebClient } from '../ts-proto/gateway/GatewayServiceClientPb'
import { EstimateAmtRequest } from '../ts-proto/gateway/gateway_pb'


global.XMLHttpRequest = require('xhr2')


const ASTAR_WASTAR = '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720'
const ASTAR_USDC = '0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98'
const ARTHSWAP_ROUTER_ADDRESS = '0xE915D2393a08a00c5A463053edD31bAe2199b9e7'

interface Amount {
  _hex: string
  _isBigNumber: boolean
}

export const estimateFee = async (amountIn: number, walletWithProvider: ethers.providers.Web3Provider, walletWithAstarProvider: ethers.Wallet): Promise<
  [number, number, number, number, number, number, number]> => {
  const test = await walletWithAstarProvider.getChainId()
  console.log(test)
  const signer = walletWithProvider.getSigner()
  const walletAddress = await signer.getAddress()


  let maticGasFee = 0
  let bridgeFee = 0
  let bridgeRate = 0
  let amountOut = 0
  let maxSlipage = 0
  let estimateAmt = 0
  let estimateGasPrice = 0

  const router = new AlphaRouter({ chainId: ChainId.POLYGON, provider: walletWithProvider })

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

  const maticAmout = CurrencyAmount.fromRawAmount(MATIC, JSBI.BigInt(ethers.utils.parseUnits(amountIn.toString())))

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

    console.log('test')

    if (route != null) {
      maticGasFee += parseFloat(route?.estimatedGasUsedQuoteToken.toFixed(6))
      amountOut += parseFloat(route?.quote.toFixed(6))

      // cBridgeの値の算出
      const estimateRequest = new EstimateAmtRequest()
      estimateRequest.setSrcChainId(ChainId.POLYGON)
      estimateRequest.setDstChainId(592)
      estimateRequest.setTokenSymbol('USDC')
      estimateRequest.setUsrAddr(walletAddress)
      estimateRequest.setSlippageTolerance(3000)
      estimateRequest.setAmt(BigNumber.from(ethers.utils.parseUnits(amountOut.toString(), 6)).toString())

      const client = new WebClient(`https://cbridge-prod2.celer.network`, null, null)
      const res = await client.estimateAmt(estimateRequest, null)
      maticGasFee += parseFloat(ethers.utils.formatUnits(res.getDropGasAmt()))
      bridgeFee = parseFloat(ethers.utils.formatUnits(res.getBaseFee(), 6)) + parseFloat(ethers.utils.formatUnits(res.getPercFee(), 6))
      bridgeRate = res.getBridgeRate()
      amountOut = estimateAmt = parseFloat(ethers.utils.formatUnits(res.getEstimatedReceiveAmt(), 6))
      maxSlipage = res.getMaxSlippage()
      estimateGasPrice = parseInt(res.getDropGasAmt())

      console.log('tetettetet')

      // ArthSwapの値の算出
      const router = new ethers.Contract(
        ARTHSWAP_ROUTER_ADDRESS,
        AstarSwapRouterABI,
        walletWithAstarProvider,
      )

      const amountOuts: Amount[] = await router.getAmountsOut(ethers.utils.parseUnits(amountOut.toString(), 6), [ASTAR_USDC, ASTAR_WASTAR])
      amountOut = parseFloat(ethers.utils.formatUnits(parseInt(amountOuts[1]._hex).toString(), 18))
      console.log(amountOut)
    }
  } catch (error) {
    console.log(error)
  }
  return [maticGasFee, bridgeFee, bridgeRate, amountOut, maxSlipage, estimateAmt, estimateGasPrice]
}
