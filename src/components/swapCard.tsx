import {Button, Card, Container, Input, Loading, Spacer} from '@nextui-org/react'
import type {NextPage} from 'next'
import styles from '../styles/SwapCard.module.css'
import Image from 'next/image'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import CoinSelect from './coinSelect'
import {SetStateAction, useCallback, useEffect, useState} from 'react'
import ChainSelect from './chainSelect'
import {Chain, Coin, TransactionData} from '@/types/utilTypes'
import ConfirmDialog from './confirmDialog'
import {useWeb3} from '@/hooks/useWeb3'
import ErrorMessage from './errorMessage'
import { EasyDex } from '@/lib/src'


const polygonCoins: Coin[] = [
  // {name: 'USDC', address: '0x00'},
  {name: 'MATIC', address: '0x00'},
  // {name: 'DAI', address: '0x00'},
  // {name: 'USDT', address: '0x00'},
]

const astarCoins: Coin[] = [
  // {name: 'USDC', address: '0x00'},
  {name: 'ASTR', address: '0x00'},
]


const SwapCard: NextPage = () => {
  const [srcChain, setSrcChain] = useState<Chain>({id: 137, name: 'Polygon'})
  const [srcCoin, setSrcCoin] = useState<Coin>({name: 'MATIC', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'})
  const [srcAmount, setSrcAmount] = useState('')
  const [dstChain, setDstChain] = useState<Chain>({id: 592, name: 'Astar'})
  const [dstCoin, setDstCoin] = useState<Coin>({name: 'ASTR', address: '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720'})
  const [dstAmount, setDstAmount] = useState('')
  const [srcData, setSrcData] = useState<TransactionData>({chain: srcChain, coin: srcCoin, amount: srcAmount})
  const [dstData, setDstData] = useState<TransactionData>({chain: dstChain, coin: dstCoin, amount: dstAmount})
  const [cost, setCost] = useState('0')
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState('')
  const [network, setNetwork] = useState(0)
  const [isLoaded, setIsLoaded] = useState(true)

  const {provider} = useWeb3()


  const handler = () => {
    setSrcData({chain: srcChain, coin: srcCoin, amount: srcAmount})
    setDstData({chain: dstChain, coin: dstCoin, amount: dstAmount})
    setVisible(true)
  }

  const closeHandler = () => {
    setVisible(false)
    console.log('closed')
  }

  const inputSrcAmount = useCallback(
      async (event: { target: { value: SetStateAction<string>; }; }) => {
        setSrcAmount(event.target.value)
        try {
          if (provider !== null) {
            setIsLoaded(false)
            const signer = provider.getSigner()
            const address = await signer.getAddress()
            const easyDex = new EasyDex(provider, parseFloat(event.target.value.toString()), address)
            const [maticGasFee, bridgeFee, bridgeRate, amountOut, maxSlipage, estimateAmt, estimateGasPrice] = await easyDex.getEstimateFee()

            if (estimateAmt < 20) {
              setError('Too small amount')
            } else {
              setError('')
            }
            setDstAmount(amountOut.toFixed(6))
            setCost(maticGasFee.toFixed(6))
            setIsLoaded(true)
          }
        } catch (error) {
          console.log(error)
        }
      },
      [srcAmount],
  )

  const inputDstAmount = useCallback(
      (event: { target: { value: SetStateAction<string>; }; }) => {
        setDstAmount(event.target.value)
      },
      [dstAmount],
  )

  const selectSrcChain = useCallback((chain: Chain) => {
    setSrcChain(chain)
  }, [srcChain])

  const selectSrcCoin = useCallback((coin: Coin) => {
    setSrcCoin(coin)
  }, [srcCoin])

  const selectDstChain = useCallback((chain: Chain) => {
    setDstChain(chain)
  }, [dstChain])

  const selectDstCoin = useCallback((coin: Coin) => {
    setDstCoin(coin)
  }, [dstCoin])

  const fetchNetwork = async () => {
    const n = await provider?.getNetwork()
    setNetwork(n ? n.chainId : 0)
  }

  // todo ネットワークをフェッチしたい
  useEffect(() => {
    fetchNetwork()
  }, [provider])


  return (
    <div className={styles.swap_card}>
      <Card>
        <Card.Body>
          <div className="top_padding_4"></div>
          <p className="common_text">From</p>
          <ChainSelect chain={srcChain} onChange={selectSrcChain}/>
          <div className={styles.src_chain_amount}>
            <Input
              size={'xl'}
              contentRightStyling={false}
              placeholder="0.0"
              fullWidth={true}
              onChange={inputSrcAmount}
              contentRight={
                <CoinSelect coinName={srcCoin.name} onChange={selectSrcCoin} currencies={polygonCoins}/>
              }
            />
          </div>
          <div className="top_padding_8"></div>
          <div className={styles.swap_icon}>
            <SwapVertIcon sx={{color: '#b8b9bb', fontSize: 30}}/>
          </div>
          <p className="common_text">To</p>
          <ChainSelect chain={dstChain} onChange={selectDstChain}/>
          <div className={styles.dst_chain_amount}>
            <Input
              size={'xl'}
              value={dstAmount}
              contentRightStyling={false}
              placeholder="0.0"
              fullWidth={true}
              readOnly={true}
              onChange={inputDstAmount}
              contentRight={
                <CoinSelect coinName={dstCoin.name} onChange={selectDstCoin} currencies={astarCoins}/>
              }
            />
          </div>
          <div className="top_padding_8"></div>
          <ErrorMessage message={error} visible={error !== ''}/>
          <div className="top_padding_16"></div>
          <Button onClick={handler} rounded css={{backgroundColor: '#1F8506'}} disabled={network !== 137 || !isLoaded || (srcAmount === '' || dstAmount === '') || error !== ''}>{isLoaded ? 'Confirm' : <Loading />}</Button>
          <div className="top_padding_8"></div>
        </Card.Body>
      </Card>
      <ConfirmDialog srcData={srcData} dstData={dstData} visible={visible} onClose={closeHandler} cost={cost}/>
    </div>
  )
}
export default SwapCard
