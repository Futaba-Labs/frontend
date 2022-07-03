import { Amount } from "@/types/web3Types";
import { BigNumber, ethers } from "ethers";
import abi from '@/utils/abi.json';
import UniswapV2RouterABI from "@/utils/artifacts/common/UniswapV2Router.json"
import StargateRouterABI from "@/utils/artifacts/common/StargateRouter.json"
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import { AlphaRouter } from "@uniswap/smart-order-router";
import { JSBI } from "quickswap-sdk";
import { factoryAddress, quoterABI, transferContractABI, transferContractAddress, uniswapv3QuoterAddress } from "@/utils/consts";
import { restoreToGeneralChainId } from "@/utils/convertChainId";
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { abi as UniswapV3Factory } from "@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json"
import { Pool } from "@uniswap/v3-sdk";

interface Immutables {
  factory: string
  token0: string
  token1: string
  fee: number
  tickSpacing: number
  maxLiquidityPerTick: ethers.BigNumber
}

interface State {
  liquidity: ethers.BigNumber
  sqrtPriceX96: ethers.BigNumber
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

export const estimateAmountAndFee = async (amountIn: number, tokenIn: string, tokenOut: string, to: string, srcChainId: number, router: string, dstChainId: number, dstTokenIn: string, dstTokenOut: string, dstRouter: string, dstSwapSkip: boolean, nativeOut: boolean, dstData: string, provider: ethers.providers.Web3Provider, dstProvider: ethers.providers.JsonRpcProvider): Promise<[number, number]> => {
  let amountOut = BigNumber.from(0)
  let fee = BigNumber.from(0)

  const convertedSrcChainId = restoreToGeneralChainId(srcChainId)
  const convertedDstChainId = restoreToGeneralChainId(dstChainId)

  const [TokenIn, TokenOut] = await getTokenInformation(tokenIn, tokenOut, provider, convertedSrcChainId)
  const parsedAmountIn = ethers.utils.parseUnits(amountIn.toString(), TokenIn.decimals)

  if (srcChainId === 9) {
    // Uniswap V3 → Stargate → Uniswap V2
    amountOut = await estimateAmountByUniswapV3(tokenIn, tokenOut, parsedAmountIn, convertedSrcChainId, provider)
    // amountOut = await estimateAmountByStargate(amountOut, convertedSrcChainId, convertedDstChainId, provider)
    amountOut = await estimateAmountByUniswapV2(amountOut, dstTokenIn, dstTokenOut, dstRouter, dstProvider)

  } else if (srcChainId === 2) {
    // Uniswap V2 → Stargate → Uniswap V3
    amountOut = await estimateAmountByUniswapV2(parsedAmountIn, tokenIn, tokenOut, router, provider)
    // amountOut = await estimateAmountByStargate(amountOut, convertedSrcChainId, convertedDstChainId, provider)
    amountOut = await estimateAmountByUniswapV3(dstTokenIn, dstTokenOut, amountOut, convertedDstChainId, dstProvider)
  }

  fee = await estimateGasFee(provider, dstChainId, to, dstData, dstRouter, dstSwapSkip, nativeOut)

  const parsedAmountOut = parseFloat(ethers.utils.formatUnits(amountOut))
  const parsedFee = parseFloat(ethers.utils.formatUnits(fee))
  return [parsedAmountOut, parsedFee]
}

const estimateAmountByUniswapV3 = async (tokenIn: string, tokenOut: string, amountIn: BigNumber, chainId: number, provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider): Promise<BigNumber> => {
  const quoterContract = new ethers.Contract(
    uniswapv3QuoterAddress,
    quoterABI,
    provider
  )
  const path = ethers.utils.solidityPack(['address', 'uint24', 'address'], [tokenIn, 3000, tokenOut]);
  const quotedAmountOut = await quoterContract.callStatic.quoteExactInput(
    path,
    amountIn
  )

  return quotedAmountOut
}

const estimateAmountByUniswapV2 = async (amountIn: BigNumber, tokenIn: string, tokenOut: string, router: string, provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider): Promise<BigNumber> => {
  const contract = new ethers.Contract(
    router,
    UniswapV2RouterABI,
    provider,
  )

  amountIn = ethers.utils.parseUnits(ethers.utils.formatUnits(amountIn, 6))

  const amountOuts: Amount[] = await contract.getAmountsOut(amountIn, [tokenIn, tokenOut])
  return BigNumber.from(parseInt(amountOuts[1]._hex).toString())
}

const estimateAmountByStargate = async (amountIn: BigNumber, srcChainId: number, dstChainId: number, provider: ethers.providers.Web3Provider): Promise<BigNumber> => {
  const contract = await getContract(provider)
  const routerAddress = contract.stargateRouter()
  const router = new ethers.Contract(
    routerAddress,
    StargateRouterABI,
    provider,
  )

  const srcPoolId = getPoolId(srcChainId)
  const dstPoolId = getPoolId(dstChainId)

  const fee = await router.getFees(srcPoolId, dstPoolId, dstChainId, amountIn)

  return amountIn.sub(fee)
}

const estimateGasFee = async (provider: ethers.providers.Web3Provider, dstChainId: number, to: string, dstData: string, dstRouter: string, dstSwapSkip: boolean, nativeOut: boolean): Promise<BigNumber> => {
  const contract = await getContract(provider)
  const quoteData = await contract.quoteLayerZeroFee(dstChainId, to, dstSwapSkip, dstData, dstRouter, nativeOut);
  return quoteData[0]
}

const getTokenInformation = async (tokenIn: string, tokenOut: string, provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider, chainId: number): Promise<[Token, Token]> => {
  const tokenInContract = new ethers.Contract(
    tokenIn,
    abi,
    provider,
  );
  const tokenOutContract = new ethers.Contract(
    tokenOut,
    abi,
    provider,
  );

  const [tokenInName, tokenInSymbol, tokenInDecimals, tokenOutName, tokenOutSymbol, tokenOutDecimals] =
    await Promise.all([
      tokenInContract.name(),
      tokenInContract.symbol(),
      tokenInContract.decimals(),
      tokenOutContract.name(),
      tokenOutContract.symbol(),
      tokenOutContract.decimals(),
    ]);

  const TokenIn = new Token(chainId, tokenIn, tokenInDecimals, tokenInSymbol, tokenInName)
  const TokenOut = new Token(chainId, tokenOut, tokenOutDecimals, tokenOutSymbol, tokenOutName)

  return [TokenIn, TokenOut]
}

const getContract = async (provider: ethers.providers.Web3Provider): Promise<ethers.Contract> => {
  const contract = new ethers.Contract(
    transferContractAddress,
    transferContractABI,
    provider,
  )

  return contract
}

const getPoolId = (chainId: number): number => {
  if (chainId === 2) {
    return 2;
  } else if (chainId === 9) {
    return 1;
  } else {
    return 0;
  }
}
async function getPoolImmutables(poolContract: ethers.Contract) {
  const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
    poolContract.factory(),
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.tickSpacing(),
    poolContract.maxLiquidityPerTick(),
  ])

  const immutables: Immutables = {
    factory,
    token0,
    token1,
    fee,
    tickSpacing,
    maxLiquidityPerTick,
  }
  return immutables
}

async function getPoolState(poolContract: ethers.Contract) {
  // note that data here can be desynced if the call executes over the span of two or more blocks.
  const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()])

  const PoolState: State = {
    liquidity,
    sqrtPriceX96: slot[0],
    tick: slot[1],
    observationIndex: slot[2],
    observationCardinality: slot[3],
    observationCardinalityNext: slot[4],
    feeProtocol: slot[5],
    unlocked: slot[6],
  }

  return PoolState
}

