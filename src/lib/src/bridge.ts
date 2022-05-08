import { BigNumber, ethers } from 'ethers'
import ERC20ABI from './abis/abi.json'
import { abi as BridgeABI } from '../contract/abi/Bridge.sol/Bridge.json'
import { ChainId } from '@uniswap/smart-order-router'
import { WebClient } from './ts-proto/gateway/GatewayServiceClientPb'
import { GetTransferStatusRequest } from './ts-proto/gateway/gateway_pb'


export const bridge = async (web3Provider: ethers.providers.Web3Provider, amount: BigNumber, maxSlipage: number): Promise<[ethers.providers.TransactionResponse | null, string]> => {
  const signer = web3Provider.getSigner()
  const walletAddress = await signer.getAddress()

  const token0Contract = new ethers.Contract(
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    ERC20ABI,
    signer,
  )

  // ここ先にapproveの判定を入れたい
  const approveResult = await token0Contract.approve(
    '0x88DCDC47D2f83a99CF0000FDF667A468bB958a78',
    ethers.utils.parseUnits('30', 6),
    {
      gasLimit: ethers.utils.hexlify(2000000),
      gasPrice: BigNumber.from(40000000000),
    },
  )

  console.log('Approving...')
  await approveResult.wait()
  console.log('Completed Approve')

  const bridge = new ethers.Contract(
    '0x88DCDC47D2f83a99CF0000FDF667A468bB958a78',
    BridgeABI,
    signer,
  )

  try {
    const tx = await bridge.send(
      walletAddress,
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      amount,
      592,
      16629,
      maxSlipage,
      {
        gasLimit: ethers.utils.hexlify(2000000),
        gasPrice: BigNumber.from(40000000000),
      },
    )

    const transfer_id = ethers.utils.solidityKeccak256(
      [
        'address',
        'address',
        'address',
        'uint256',
        'uint64',
        'uint64',
        'uint64',
      ],
      [
        walletAddress, /// User's wallet address,
        walletAddress, /// User's wallet address,
        '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        amount, /// Send amount in String
        592, /// Destination chain id
        16629, /// Nonce
        ChainId.POLYGON, /// Source chain id
      ],
    )

    return [tx, transfer_id]


  } catch (error) {
    console.log(error)
  }

  return [null, '']
}

export async function checkBridgeStatus(client: WebClient, request: GetTransferStatusRequest): Promise<boolean> {
  return await new Promise((resolve) => {
    const interval = setInterval(async () => {
      const response = await client.getTransferStatus(request, null)
      const status = response.getStatus()
      if (status === 5) {
        console.log('TRANSFER_COMPLETED')
        resolve(true)
        clearInterval(interval)
      } else if (status === 2) {
        console.log('TRANSFER_FAILED')
        resolve(false)
        clearInterval(interval)
      } else if (status === 1
      ) {
        console.log('TRANSFER_SUBMITTING')
      }
    }, 5000)
  })
}
