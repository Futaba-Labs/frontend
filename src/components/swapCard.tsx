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
import { useContract } from '@/hooks/useContract'
import { BigNumber, ethers } from 'ethers'
import { bscToRinkebyData, polygonToBscData, transferContractAddress } from '@/utils/consts'
import { estimateAmountAndFee } from '@/lib'
import abi from '@/utils/abi.json'
import { parseUnits } from 'ethers/lib/utils'



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
  const contract = useContract()


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
        console.log('test')
        setSrcAmount(event.target.value)
        try {
          if (provider !== null) {
            setIsLoaded(false)
            const dstProvider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org")

      const amountIn = parseUnits('1', 16)
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

      // const path = ethers.utils.solidityPack(['address', 'uint24', 'address'], [dstTokenIn, 3000, dstTokenOut]);
      // const params = {
      //   path,
      //   recipient,
      //   deadline: feeDeadline,
      //   amountIn,
      //   amountOutMinimum: parseUnits('1', 4),
      // };

      // const dstData = ethers.utils.defaultAbiCoder.encode(
      //   ['(bytes path, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum)'],
      //   [params]
      // );

      // const srcData = ethers.utils.defaultAbiCoder.encode(
      //   ['uint256', 'uint256', 'address[]', 'address', 'uint256'],
      //   [amountIn, amountIn.div(3), [tokenIn, tokenOut], transferContractAddress, feeDeadline]
      // );
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
        srcChainId: polygonToBscData.srcChainId,
        dstChainId: polygonToBscData.dstChainId
      }

      if(provider) {
        const [amountOut, fee] = await estimateAmountAndFee(parseFloat(event.target.value.toString()), tokenIn, tokenOut, recipient, desc.srcChainId, router,desc.dstChainId, dstTokenIn, dstTokenOut, dstRouter, false, false, dstData, provider, dstProvider)
        console.log(`amountOut: ${amountOut} fee: ${fee}`)

        setDstAmount(amountOut.toString())
        setCost(fee.toString())
        setIsLoaded(true)
      }
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

  const setCrossChainRouter = async () => {
    if(contract) {
      // chainId, routerAddress
      // await contract.setCrossChainRouter(2, "0x4B5896a0bFF0B77946009B0DBADD298a348fF6b2")
      await contract.setCrossChainRouter(10001, "0xdf23e884F3728330FDb8f358e359E8458721C32F")

      // const result = await contract.crossRouters(10001)
      // console.log(result)

      // const tx = await contract.refundToken("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174")
      // await tx.wait()
      // console.log(tx)
    }
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
