import { BigNumber, ethers } from 'ethers'
import { abi as AstarSwapRouterABI } from './abis/AstarSwapRouter.json'
import ERC20ABI from './abis/abi.json'

const WASTAR = '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720'
const USDC = '0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98'
const ROUTER_ADDRESS = '0xE915D2393a08a00c5A463053edD31bAe2199b9e7'

interface Amount {
  _hex: string
  _isBigNumber: boolean
}

export const arthswap = async (web3Provider: ethers.providers.Web3Provider, amountIn: BigNumber): Promise<ethers.providers.TransactionResponse | null> => {
  try {
    const signer = web3Provider.getSigner()
    const walletAddress = await signer.getAddress()

    const router = new ethers.Contract(
      ROUTER_ADDRESS,
      AstarSwapRouterABI,
      signer,
    )

    const token0Contract = new ethers.Contract(
      USDC,
      ERC20ABI,
      signer,
    )
    const balance: BigNumber = await token0Contract.balanceOf(walletAddress)
    const transferrableAmout = amountIn.gt(balance) ? balance : amountIn
    console.log(balance, transferrableAmout)
    const approveResult = await token0Contract.approve(
      ROUTER_ADDRESS,
      balance,
    )
    console.log('Approving...')
    await approveResult.wait()
    console.log('Completed Approved')

    const transaction = await router.swapExactTokensForETH(
      transferrableAmout, 0, [USDC, WASTAR], walletAddress, Math.floor(Date.now() / 1000) + (60 * 10),
      {
        gasLimit: ethers.utils.hexlify(2000000),
      },
    )

    return transaction
  } catch (e) {
    console.log(e)
    return null
  }
}
