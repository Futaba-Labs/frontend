import type {NextPage} from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Menu from '@/components/menu'
import SwapCard from '@/components/swapCard'
import {Button, Container} from '@nextui-org/react'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import StatusDialog from '@/components/statusDialog'
import {useEffect, useState} from 'react'
import {useWeb3} from '@/hooks/useWeb3'
import { parseUnits } from 'ethers/lib/utils'
import { BigNumber, ethers } from 'ethers'
import { keccak256 } from '@ethersproject/solidity';
import abi from '@/utils/abi.json'
import { useContract } from '@/hooks/useContract'
import { bscToRinkebyData, messageBusABI, polygonToBscData, rinkebyToBscTestnetData, transferContractABI, transferContractAddress } from '@/utils/consts'
import background from '../images/background.png'

enum BridgeType {
  Null,
  Liquidity,
  PegDeposit,
  PegBurn,
  PegDepositV2,
  PegBurnV2
}

const Home: NextPage = () => {
  const {provider, transactionStatuses, visible, setVisible} = useWeb3()
  const contract = useContract()

  const setCrossChainRouter = async () => {
    if(contract) {
      // chainId, routerAddress
      await contract.setCrossChainRouter(2, "0x4B5896a0bFF0B77946009B0DBADD298a348fF6b2")

      // const result = await contract.crossRouters(2)
      // console.log(result)

      // const tx = await contract.refundToken("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174")
      // await tx.wait()
      // console.log(tx)
    }
  }

  const transferSwap = async () => {
    try {
      const amountIn = parseUnits('1', 4)
      const tokenIn = polygonToBscData.tokenIn
      const tokenOut = polygonToBscData.tokenOut
      const dstTokenIn = polygonToBscData.dstTokenIn
      const dstTokenOut = polygonToBscData.dstTokenOut
      const router = polygonToBscData.router
      const dstRouter = polygonToBscData.dstRouter
      const recipient = "0x221E25Ad7373Fbaf33C7078B8666816586222A09";
      const feeDeadline = BigNumber.from(Math.floor(Date.now() / 1000 + 1800));

      const path = ethers.utils.solidityPack(['address', 'uint24', 'address'], [tokenIn, 3000, tokenOut]);
      const params = {
        path,
        recipient: transferContractAddress,
        deadline: feeDeadline,
        amountIn,
        amountOutMinimum: parseUnits('1', 4),
      };
      const srcData = ethers.utils.defaultAbiCoder.encode(
        ['(bytes path, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum)'],
        [params]
      );

      const dstData = ethers.utils.defaultAbiCoder.encode(
        ['uint256', 'uint256', 'address[]', 'address', 'uint256'],
        [amountIn, amountIn.div(3), [dstTokenIn, dstTokenOut], recipient, feeDeadline]
      );

      // const dstDesc = ethers.utils.defaultAbiCoder.encode(
      //   ['uint256', 'uint256', 'address[]', 'address', 'uint256'],
      //   [amountIn, amountIn.div(2), [dstTokenIn, dstTokenOut], recipient, feeDeadline]
      // );

      // address payable to;
      //   bool nativeIn;
      //   bool nativeOut;
      //   uint256 amountIn;
      //   address tokenIn;
      //   address tokenOut;
      //   address dstTokenOut;
      //   address router;
      //   address dstRouter;
      //   uint16 srcChainId;
      //   uint16 dstChainId;

      const desc = {
        to: recipient,
        nativeIn: false,
        nativeOut: false,
        amountIn,
        tokenIn,
        tokenOut,
        srcSkipSwap: true,
        dstSkipSwap: false,
        dstTokenOut,
        router,
        dstRouter,
        srcChainId: polygonToBscData.srcChainId,
        dstChainId: polygonToBscData.dstChainId
      }

      if(provider) {
        const signer = provider.getSigner()

        const token0Contract = new ethers.Contract(
          tokenIn,
          abi,
          signer,
        )

        const approveResult = await token0Contract.approve(
          transferContractAddress,
          amountIn.mul(2),
    )
    await approveResult.wait()
    if(contract) {
      const quoteData = await contract.quoteLayerZeroFee(desc.dstChainId, recipient, false, dstData, dstRouter, false);
      console.log('fee:', quoteData[0])
      const gasFee: BigNumber = quoteData[0]
      const tx = await contract.transferWithSwap(desc, srcData, dstData, { gasLimit: ethers.utils.hexlify(2000000), value: gasFee },
  )
  await tx.wait()
  console.log(tx)
    }
      }

        } catch (error) {
          console.log(error)
        }
      }

  const closeHandler = () => {
    setVisible(false)
  }

  const hex2Bytes = (hexString: string): number[] => {
    let hex = hexString;
    const result = [];
    if (hex.substr(0, 2) === '0x') {
      hex = hex.slice(2);
    }
    if (hex.length % 2 === 1) {
      hex = '0' + hex;
    }
    for (let i = 0; i < hex.length; i += 2) {
      result.push(parseInt(hex.substr(i, 2), 16));
    }
    return result;
  }

  useEffect(() => {
  }, [provider])
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.absolute_menu}><Menu /></div>
      </header>
      <div className={styles.relative}>
      </div>
      {/* <Button onClick={async () => await transferSwap()}>Button</Button>
      <Button onClick={async () => await setCrossChainRouter()}>SetRouter</Button> */}
      
      <SwapCard />
      <StatusDialog visible={visible} onClose={closeHandler} transactionStatuses={transactionStatuses}/>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        position={'bottom-right'}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      </div>
     
      
  )
}

export default Home
