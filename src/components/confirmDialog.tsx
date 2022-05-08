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


interface Props {
  srcData: TransactionData
  dstData: TransactionData
  visible: boolean
  cost: string
  onClose: () => void
}

const ComfirmDialog: NextPage<Props> = (props) => {
  const {provider, transactionStatuses, setTransactionStatuses, visible, setVisible} = useWeb3()
  const price = (parseFloat(props.dstData.amount) / parseFloat(props.srcData.amount)).toFixed(6)

  const [isLoaded, setIsLoaded] = useState(true)

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
        setTransactionStatuses([...transactionStatuses, {step: 1, transactionHash: transaction!.hash}])
        await transaction!.wait()
        console.log('Completed Swap')
        await easyDex.completeSwap()
        transaction = await easyDex.bridge()
        if (!transaction) return handleError('Bridge Failed')
        console.log(transactionStatuses)
        setTransactionStatuses([...transactionStatuses, {step: 2, transactionHash: transaction!.hash}])
        await transaction!.wait()
        const result = await easyDex.waitBridge()
        if (!result) return handleError('Bridge Failed')
        await easyDex.switchNetwork()
        const astarProvider = provider
        await easyDex.setWeb3Provider(astarProvider)
        transaction = await easyDex.swapByArthswap()
        setTransactionStatuses([...transactionStatuses, {step: 3, transactionHash: transaction!.hash}])
        if (!transaction) return handleError('Swap Failed')
        await transaction?.wait()
        setTransactionStatuses([...transactionStatuses, {step: 4, transactionHash: transaction!.hash}])
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
          <p className="black_text">Confirm Exchange</p>
          <div className={styles.swap_predict}>
            <Row justify={'space-between'} className="bottom_padding_8">
              <Col>
                <Row justify={'flex-start'}>
                  <div className="left_padding_4"></div>
                  <Col><Image src={getCoinImage(props.srcData.coin.name)} width={27} height={27}/></Col>
                  <Col className="top_padding_4"><span className="black_text">{props.srcData.amount}</span></Col>
                </Row>
              </Col>
              <Spacer x={6}/>
              <Col className="top_padding_4 text_right">
                <span className="black_text">{props.srcData.coin.name}</span>
              </Col>
            </Row>
            <ArrowDownwardIcon sx={{color: '#b8b9bb', fontSize: 30}}/>
            <div className="top_padding_4"></div>
            <Row justify={'space-between'} className="bottom_padding_8">
              <Col>
                <Row>
                  <Col><Image src={getCoinImage(props.dstData.coin.name)} width={32} height={32}/></Col>
                  <Col className="top_padding_4"><span className="black_text">{props.dstData.amount}</span></Col>
                </Row>
              </Col>
              <Spacer x={1}/>
              <Col className="top_padding_4 text_right">
                <span className="black_text">{props.dstData.coin.name}</span>
              </Col>
            </Row>
          </div>
          <div className={styles.swap_price}>
            <Row justify={'flex-start'} fluid={true}>
              <span className="common_small_text">price</span>
              <Spacer x={3}/>
              <div className={styles.price_list}>
                <Image src={getCoinImage(props.srcData.coin.name)} width={18} height={14}/>
                <span className="black_small_text">1 {props.srcData.coin.name}</span>
                <div className="left_padding_4"></div>
                      =
                <div className="left_padding_4"></div>
                <Image src={getCoinImage(props.dstData.coin.name)} width={19} height={15}/>
                <span className="black_small_text">{price} {props.dstData.coin.name}</span>
              </div>
            </Row>
          </div>
          <Container fluid={true} className={styles.detail}>
            <Row justify={'space-between'}>
              <Col>
                <span className="common_small_text">Cost</span>
              </Col>
              <Col className="text_right top_padding_4">
                <span className="black_small_text">{props.cost} {props.srcData.coin.name}</span>
              </Col>
            </Row>
            <Row justify={'space-between'}>
              <Col>
                <span className="common_small_text">Time required</span>
              </Col>
              <Col className="text_right top_padding_4">
                <span className="black_small_text">10~20 min</span>
              </Col>
            </Row>
            <Row justify={'space-between'}>
              <Col>
                <span className="common_small_text">Lowest price</span>
              </Col>
              <Col className="text_right top_padding_4">
                <span className="black_small_text">{parseFloat(props.dstData.amount) * 0.97} {props.dstData.coin.name}</span>
              </Col>
            </Row>
            <Row justify={'space-between'}>
              <Col>
                <span className="common_small_text">Slippage Tolerance</span>
              </Col>
              <Col className="text_right top_padding_4">
                <span className="black_small_text">3%</span>
              </Col>
            </Row>
          </Container>
          <Container fluid={true}>
            <Image src={SwapRoute} objectFit="contain"/>
          </Container>
          <div className="top_padding_8"></div>
          <Button onClick={() => execute()} rounded css={{backgroundColor: '#1F8506'}} disabled={!isLoaded}>{isLoaded ? 'Exchange' : <Loading />}</Button>
          <div className="top_padding_8"></div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ComfirmDialog
