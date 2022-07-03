import type {NextPage} from 'next'
import styles from '../styles/ComfirmDialog.module.css'
import {useState} from 'react'
import {Modal, Input, Row, Card, Button, Text, Divider, Col, Spacer, Container, Loading} from '@nextui-org/react'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import {Chain, Coin, TransactionData, TransactionStatus} from '@/types/utilTypes'
import Image from 'next/image'
import SwapRoute from '../images/swap_route.png'
import {useWeb3} from '@/hooks/useWeb3'
import {getCoinImage} from '@/utils/handleChainAndCoin'
import {toast} from 'react-toastify'
import StatusDialog from './statusDialog'
import { EasyDex } from '@/lib/src'
import { BigNumber, ethers } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import { bscToRinkebyData, transferContractAddress } from '@/utils/consts'
import abi from '@/utils/abi.json'
import { useContract } from '@/hooks/useContract'


interface Props {
  srcData: TransactionData
  dstData: TransactionData
  visible: boolean
  cost: string
  onClose: () => void
}

const ComfirmDialog: NextPage<Props> = (props) => {
  const {provider, transactionStatuses, addTransactionStatus, visible, setVisible} = useWeb3()
  const price = (parseFloat(props.dstData.amount) / parseFloat(props.srcData.amount)).toFixed(6)
  const contract = useContract()

  const [isLoaded, setIsLoaded] = useState(true)

  const transferSwap = async () => {
    try {
      const dstProvider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org")

      const amountIn = parseUnits('1', 16)
      const tokenIn = bscToRinkebyData.tokenIn
      const tokenOut = bscToRinkebyData.tokenOut
      const dstTokenIn = bscToRinkebyData.dstTokenIn
      const dstTokenOut = bscToRinkebyData.dstTokenOut
      const router = bscToRinkebyData.router
      const dstRouter = bscToRinkebyData.dstRouter
      const recipient = "0x221E25Ad7373Fbaf33C7078B8666816586222A09";
      const feeDeadline = BigNumber.from(Math.floor(Date.now() / 1000 + 1800));

      // const path = ethers.utils.solidityPack(['address', 'uint24', 'address'], [tokenIn, 3000, tokenOut]);
      // const params = {
      //   path,
      //   recipient: transferContractAddress,
      //   deadline: feeDeadline,
      //   amountIn,
      //   amountOutMinimum: parseUnits('1', 4),
      // };
      // const srcData = ethers.utils.defaultAbiCoder.encode(
      //   ['(bytes path, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum)'],
      //   [params]
      // );

      // const dstData = ethers.utils.defaultAbiCoder.encode(
      //   ['uint256', 'uint256', 'address[]', 'address', 'uint256'],
      //   [amountIn, amountIn.div(3), [dstTokenIn, dstTokenOut], recipient, feeDeadline]
      // );

      const path = ethers.utils.solidityPack(['address', 'uint24', 'address'], [dstTokenIn, 3000, dstTokenOut]);
      const params = {
        path,
        recipient,
        deadline: feeDeadline,
        amountIn,
        amountOutMinimum: parseUnits('1', 4),
      };

      const dstData = ethers.utils.defaultAbiCoder.encode(
        ['(bytes path, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum)'],
        [params]
      );

      const srcData = ethers.utils.defaultAbiCoder.encode(
        ['uint256', 'uint256', 'address[]', 'address', 'uint256'],
        [amountIn, amountIn.div(3), [tokenIn, tokenOut], transferContractAddress, feeDeadline]
      );
      const desc = {
        to: recipient,
        nativeIn: false,
        nativeOut: true,
        amountIn,
        tokenIn,
        tokenOut,
        srcSkipSwap: true,
        dstSkipSwap: false,
        dstTokenOut,
        router,
        dstRouter,
        srcChainId: bscToRinkebyData.srcChainId,
        dstChainId: bscToRinkebyData.dstChainId
      }
      if(provider) {
        setIsLoaded(false)
        props.onClose()
        setVisible(true)
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
      const quoteData = await contract.quoteLayerZeroFee(desc.dstChainId, recipient, desc.dstSkipSwap, dstData, dstRouter, desc.nativeOut);
      console.log('fee:', quoteData[0])
      const gasFee: BigNumber = quoteData[0]
      const tx = await contract.transferWithSwap(desc, srcData, dstData, { gasLimit: ethers.utils.hexlify(2000000), value: gasFee },
  )
  await tx.wait()
  console.log(tx)
  setIsLoaded(true)
        props.onClose()
        toast.success('Transaction Completed')
    }
      }

        } catch (error) {
          console.log(error)
          handleError('Swap Failed')
        }
      }

  const closeHandler = () => {
    setVisible(false)
  }

  const handleError = (text: string) => {
    closeHandler()
    props.onClose()
    toast.error('Transaction Failed')
    setIsLoaded(true)
    return
  }

  const execute = async () => {
    try {
      if (provider !== null) {
        setIsLoaded(false)
        props.onClose()
        setVisible(true)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const easyDex = new EasyDex(provider, parseFloat(props.srcData.amount), address)
        const [maticGasFee, bridgeFee, bridgeRate, amountOut, maxSlipage, estimateAmt, estimateGasPrice] = await easyDex.getEstimateFee()
        if (amountOut === 0) return handleError('Transaction Error')
        let transaction = await easyDex.swapByUniswap()
        if (!transaction) return handleError('Swap Failed')
        addTransactionStatus({step: 1, transactionHash: transaction!.hash})
        await transaction!.wait()
        console.log('Completed Swap')
        await easyDex.completeSwap()
        transaction = await easyDex.bridge()
        if (!transaction) return handleError('Bridge Failed')
        addTransactionStatus({step: 2, transactionHash: transaction!.hash})
        await transaction!.wait()
        const result = await easyDex.waitBridge()
        if (!result) return handleError('Bridge Failed')
        await easyDex.switchNetwork()
        const astarProvider = provider
        await easyDex.setWeb3Provider(astarProvider)
        transaction = await easyDex.swapByArthswap()
        addTransactionStatus({step: 3, transactionHash: transaction!.hash})
        if (!transaction) return handleError('Swap Failed')
        await transaction?.wait()
        addTransactionStatus({step: 4, transactionHash: transaction!.hash})
        setIsLoaded(true)
        props.onClose()
        toast.success('Transaction Completed')
      }
    } catch (error) {
      handleError('Transaction Failed')
      console.log(error)
    }
  }

  return (
    <>
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={props.visible}
        onClose={() => props.onClose()}
      >
        <Modal.Body>
          <p className={styles.title}>Confirm Exchange</p>
          <div className={styles.swap_predict}>
            <Row justify={'space-between'} className="bottom_padding_8">
              <Col>
                <Row justify={'flex-start'}>
                  <div className="left_padding_4"></div>
                  <Col><Image src={getCoinImage(props.srcData.coin.name)} width={27} height={27}/></Col>
                  <Col className="top_padding_4"><span className={styles.content_text}>{props.srcData.amount}</span></Col>
                </Row>
              </Col>
              <Spacer x={6}/>
              <Col className="top_padding_4 text_right">
                <span className={styles.content_text}>{props.srcData.coin.name}</span>
              </Col>
            </Row>
            <ArrowDownwardIcon sx={{color: '#b8b9bb', fontSize: 30}}/>
            <div className="top_padding_4"></div>
            <Row justify={'space-between'} className="bottom_padding_8">
              <Col>
                <Row>
                  <Col><Image src={getCoinImage(props.dstData.coin.name)} width={32} height={32}/></Col>
                  <Col className="top_padding_4"><span className={styles.content_text}>{props.dstData.amount}</span></Col>
                </Row>
              </Col>
              <Spacer x={1}/>
              <Col className="top_padding_4 text_right">
                <span className={styles.content_text}>{props.dstData.coin.name}</span>
              </Col>
            </Row>
          </div>
          <div className={styles.swap_price}>
            <Row justify={'flex-start'} fluid={true}>
              <span className={styles.content_text_small}>price</span>
              <Spacer x={3}/>
              <div className={styles.price_list}>
                <Image src={getCoinImage(props.srcData.coin.name)} width={24} height={14}/>
                <span className={styles.content_text_small}>1 {props.srcData.coin.name}</span>
                <div className="left_padding_4"></div>
                      =
                <div className="left_padding_4"></div>
                <Image src={getCoinImage(props.dstData.coin.name)} width={24} height={15}/>
                <span className={styles.content_text_small}>{price} {props.dstData.coin.name}</span>
              </div>
            </Row>
          </div>
          <Container fluid={true} className={styles.detail}>
            <Row justify={'space-between'}>
              <Col>
                <span className={styles.content_text_small_silver}>Cost</span>
              </Col>
              <Col className="text_right top_padding_4">
                <span className={styles.content_text_small}>{props.cost} {props.srcData.coin.name}</span>
              </Col>
            </Row>
            <Row justify={'space-between'}>
              <Col>
                <span className={styles.content_text_small_silver}>Time required</span>
              </Col>
              <Col className="text_right top_padding_4">
                <span className={styles.content_text_small}>10~20 min</span>
              </Col>
            </Row>
            <Row justify={'space-between'}>
              <Col>
                <span className={styles.content_text_small_silver}>Lowest price</span>
              </Col>
              <Col className="text_right top_padding_4">
                <span className={styles.content_text_small}>{parseFloat(props.dstData.amount) * 0.97} {props.dstData.coin.name}</span>
              </Col>
            </Row>
            <Row justify={'space-between'}>
              <Col>
                <span className={styles.content_text_small_silver}>Slippage Tolerance</span>
              </Col>
              <Col className="text_right top_padding_4">
                <span className={styles.content_text_small}>3%</span>
              </Col>
            </Row>
          </Container>
          <Container fluid={true}>
            <Image src={SwapRoute} objectFit="contain"/>
          </Container>
          <div className="top_padding_8"></div>
          <Button onClick={() => transferSwap()} rounded css={{backgroundColor: '#1F8506'}} disabled={!isLoaded}>{isLoaded ? 'Exchange' : <Loading />}</Button>
          <div className="top_padding_8"></div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ComfirmDialog
