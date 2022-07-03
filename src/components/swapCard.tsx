import {Button, Card, Container, createTheme, Input, Loading, NextUIProvider, Spacer} from '@nextui-org/react'
import type {NextPage} from 'next'
import styles from '../styles/SwapCard.module.css'
import Image from 'next/image'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import CoinSelect from './coinSelect'
import {SetStateAction, useCallback, useEffect, useState} from 'react'
import ChainSelect from './chainSelect'
import Chains from './Chains'
import bnbChain from './bnbChain'
import {Chain, Coin, TransactionData} from '@/types/utilTypes'
import ConfirmDialog from './confirmDialog'
import {useWeb3} from '@/hooks/useWeb3'
import ErrorMessage from './errorMessage'
import { EasyDex } from '@/lib/src'
import cross_arrow from '../images/cross_arrow.png'
import { color } from '@mui/system'
import OptionSelect from './optionSelect'
import matic from '../images/currency/matic.png'
import bnb from '../images/currency/binance_logo.png'
import Chains2 from './Chains2'


const polygonCoins: Coin[] = [
  // {name: 'USDC', address: '0x00'},
  {name: 'MATIC', address: '0x00'},
  // {name: 'DAI', address: '0x00'},
  // {name: 'USDT', address: '0x00'},
]

const binanceCoins: Coin[] = [
  // {name: 'USDC', address: '0x00'},
  {name: 'BNB', address: '0x00'},
]


const SwapCard: NextPage = () => {
  const [srcChain, setSrcChain] = useState<Chain>({id: 137, name: 'Polygon'})
  const [srcCoin, setSrcCoin] = useState<Coin>({name: 'MATIC', address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'})
  const [srcAmount, setSrcAmount] = useState('')
  const [dstChain, setDstChain] = useState<Chain>({id: 592, name: 'Astar'})
  const [dstCoin, setDstCoin] = useState<Coin>({name: 'BNB', address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'})
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

  const myTheme = createTheme({
    type:"dark",
    theme: {
      colors: {
        backcolor:"#383838",
        waring:"#333333",
        primary: '#383838',
      },

      // ...
    }
  });
  const darkTheme = createTheme({
    type: "dark",
    theme: {
      colors: { background: '#1d1d1d',
      text: '#fff',
      // you can also create your own color
      myDarkColor: '#ff4ecd'}
    }
  });

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
       <NextUIProvider theme={darkTheme}>
      <Card css={{backgroundColor:'#001100'}}>
        <Card.Body>
          <div className="top_padding_4"></div>
          <div className={styles.top_swap_bar}>
          <p className="common_text">Chain</p> <OptionSelect /></div>
          <div className={styles.chain_select} >
            <Chains chain={srcChain} onChange={selectSrcChain}/> 
          <div className={styles.cross_arrow} >
            <Image src={cross_arrow} width={20} height={20} alt="aa" /></div> 
            <Chains2 chain={srcChain} onChange={selectSrcChain}/> 
            </div>
          <div className="top_padding_8"></div> <div className="top_padding_8"></div>
         <div className={styles.coin_select_box}>
      <div className={styles.src_chain_amount}>
       <div className={styles.currency_title}>from</div> 
     
      <Input
              size={'xl'}
              shadow={false}
              css={{$$inputColor: "#383838"}}
              contentRightStyling={false}
              placeholder="0.0"
              fullWidth={true}
              onChange={inputSrcAmount}
              contentRight={
                <CoinSelect coinName={srcCoin.name} onChange={selectSrcCoin} currencies={polygonCoins}/>
              }
            />
            
            </div>
            <div className={styles.dst_chain_amount}>
            <Input
            css={{$$inputColor: "#383838"}}
              size={'xl'}
              value={dstAmount}
              contentRightStyling={false}
              placeholder="0.0"
              fullWidth={true}
              readOnly={true}
              onChange={inputDstAmount}
              contentRight={
                <CoinSelect coinName={dstCoin.name} onChange={selectDstCoin} currencies={binanceCoins}/>
              }
            />
          </div>
          
            </div>
      
          
          <div className="top_padding_8"></div>
          <div className="top_padding_8"></div>
        <div className={styles.price_rate}>
            <div className={styles.price_rate_text}>price</div>
            <div className={styles.price_rate_currency}>
            <div className={styles.price_rate_currency_text}>1MATIC     =</div>
            <div className={styles.price_rate_currency_text}>0.002BNB</div>
            </div>
          </div>
        
       

          <div className="top_padding_8"></div>
          <ErrorMessage message={error} visible={error !== ''}/>
          <div className="top_padding_8"></div>
          <div className="top_padding_8"></div>
          <Button onClick={handler} rounded css={{backgroundColor: '#3ABB5E'}} color="success" shadow disabled={network !== 137 || !isLoaded || (srcAmount === '' || dstAmount === '') || error !== ''}>{isLoaded ? 'Confirm' : <Loading />}</Button>
          <div className="top_padding_8"></div>
          <div className="top_padding_8"></div>
        </Card.Body>
      </Card>
      <ConfirmDialog srcData={srcData} dstData={dstData} visible={visible} onClose={closeHandler} cost={cost}/>
      </NextUIProvider>
    </div>
  )
}
export default SwapCard
