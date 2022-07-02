import abi from './NFTMarketplace.json'
import transferABI from "./artifacts/goerli/TransferSwapper.json";
import messageABI from "./artifacts/goerli/MessageBus.json"
import bscTransferABI from './artifacts/bscTest/TransferSwapper.json'
import polygonTransferABI from './artifacts/polygon/TransferSwapper.json'

export const contractABI = abi.abi
export const contractAddress = '0x651985C6A1472D33f50DcB6cC2Df841566b268f2'

export const transferContractABI = polygonTransferABI.abi
export const transferContractAddress = "0x29F558023ddcED57E8B3A47743c575D11f141912"
// export const transferContractAddress = "0xABa3210570C5971DF9731eA00D5Bf1BA206C76Cf"

export const messageBusABI = messageABI.abi

export const bscToRinkebyData = {
  tokenIn: "0xF49E250aEB5abDf660d643583AdFd0be41464EfD", // USDT
  tokenOut: "0xF49E250aEB5abDf660d643583AdFd0be41464EfD", // USDT
  router: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1", // Pancakeswap
  dstRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564", // Uniswap v3
  dstTokenIn: "0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4", // USDC
  dstTokenOut: "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735", // DAI
  srcChainId: 10002,
  dstChainId: 10001
}

export const rinkebyToBscTestnetData = {
  tokenIn: "0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4", // DAI
  tokenOut: "0x1717A0D5C8705EE89A8aD6E808268D6A826C97A4", // USDC
  router: "0xE592427A0AEce92De3Edee1F18E0157C05861564", // Uniswap v3
  dstRouter: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1", // Pancakeswap
  dstTokenIn: "0xF49E250aEB5abDf660d643583AdFd0be41464EfD", // USDC
  dstTokenOut: "0xF49E250aEB5abDf660d643583AdFd0be41464EfD", // DAI
  srcChainId: 10001,
  dstChainId: 10002
}

export const polygonToBscData = {
  tokenIn: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", // AAVE
  // tokenIn: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // AAVE
  tokenOut: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
  router: "0xE592427A0AEce92De3Edee1F18E0157C05861564", // Uniswap v3
  dstRouter: "0x10ED43C718714eb63d5aA57B78B54704E256024E", // Pancakeswap
  dstTokenIn: "0x55d398326f99059fF775485246999027B3197955", // USDT
  dstTokenOut: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD
  srcChainId: 9,
  dstChainId: 2
}
