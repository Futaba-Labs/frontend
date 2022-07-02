import { Amount } from "@/types/web3Types";
import { BigNumber, ethers } from "ethers";
import abi from '@/utils/abi.json';
import UniswapV2RouterABI from "@/utils/artifacts/common/UniswapV2Router.json"
import StargateRouterABI from "@/utils/artifacts/common/StargateRouter.json"
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import { AlphaRouter } from "@uniswap/smart-order-router";
import { JSBI } from "quickswap-sdk";
import { transferContractABI, transferContractAddress } from "@/utils/consts";
import { restoreToGeneralChainId } from "@/utils/convertChainId";



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
    // amountOut = await estimateAmountByUniswapV2(amountOut, dstTokenIn, dstTokenOut, dstRouter, dstProvider)

  } else if (srcChainId === 2) {
    // Uniswap V2 → Stargate → Uniswap V3
    amountOut = await estimateAmountByUniswapV2(parsedAmountIn, tokenIn, tokenOut, router, provider)
    amountOut = await estimateAmountByStargate(amountOut, convertedSrcChainId, convertedDstChainId, provider)
    amountOut = await estimateAmountByUniswapV3(dstTokenIn, dstTokenOut, amountOut, convertedDstChainId, dstProvider)
  }

  fee = await estimateGasFee(provider, dstChainId, to, dstData, dstRouter, dstSwapSkip, nativeOut)

  const parsedAmountOut = parseFloat(ethers.utils.formatUnits(amountOut))
  const parsedFee = parseFloat(ethers.utils.formatUnits(fee))
  return [parsedAmountOut, parsedFee]
}

const estimateAmountByUniswapV3 = async (tokenIn: string, tokenOut: string, amountIn: BigNumber, chainId: number, provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider): Promise<BigNumber> => {

  const router = new AlphaRouter({ chainId: chainId, provider: provider })
  const [TokenIn, TokenOut] = await getTokenInformation(tokenIn, tokenOut, provider, chainId)
  console.log(chainId)

  const tokenInAmount = CurrencyAmount.fromRawAmount(TokenIn, JSBI.BigInt('1000000000000000000'))

  // https://docs.uniswap.org/protocol/reference/periphery/lens/Quoter#quoteexactinputに変更する

  try {
    const route = await router.route(
      tokenInAmount,
      TokenOut,
      TradeType.EXACT_INPUT,
      {
        recipient: transferContractAddress,
        slippageTolerance: new Percent(3, 100),
        deadline: Math.floor(Date.now() / 1000 + 1800),
      },
    )

    if (route != null) {
      return BigNumber.from(route?.quote.toFixed(TokenOut.decimals))
    }
  } catch (error) {
    console.log(`${error}`)
  }

  return BigNumber.from(0);
}

const estimateAmountByUniswapV2 = async (amountIn: BigNumber, tokenIn: string, tokenOut: string, router: string, provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider): Promise<BigNumber> => {
  const contract = new ethers.Contract(
    router,
    UniswapV2RouterABI,
    provider,
  )

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
