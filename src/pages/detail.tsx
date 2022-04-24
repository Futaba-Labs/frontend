import Button from '@/components/Button'
import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Detail.module.css'
import menubar from '../images/menu.png'
import nft from '../images/NFT-1.png'
import {Card, Grid, Row, Text} from '@nextui-org/react'
import Ethereum_logo from '../images/ethereum_logo.png'
import JPYC_logo from '../images/jpyc_logo.png'
import {height, style} from '@mui/system'
import Title from '@/components/Title'
import Heading from '@/components/Heading'
import NFTCard from '@/components/NFTCard'
import PurchaseModal from '@/components/PurchaseModal'
import MenuBar from '@/components/MenuBar'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useContract } from '@/hooks/useContract'
import { NFT } from '@/types/web3Types'
import { JPYCSwap } from '@t_adachi/jpyc-swap'
import { useWeb3 } from '@/hooks/useWeb3'

const Detail: NextPage = () => {
  const router = useRouter();
  const result: string = router.query.id as string;
  const [nft, setNFT] = useState<NFT | null>(null);
  const contract = useContract()
  const {provider} = useWeb3()
  
  const fetchTargetNFT = async () => {
    try {
      if(contract) {
        setNFT(null)
        const items = await contract.fetchMarketItems();
        const jpycSwap = new JPYCSwap(provider!, 4)
        items.map(async (item: any) => {
          console.log(result)
          const tokenId = item.tokenId
          if(tokenId == result) {
            console.log('cxuwgiuc')
            const tokenURI = await contract.tokenURI(tokenId)
            const jpycPrice = await jpycSwap.showPrice(parseInt(item.price._hex))
            setNFT({tokenId: tokenId, name: "test", price: parseInt(item.price._hex), jpycPrice: jpycPrice, image: tokenURI})
          }
        })
      }
    } catch(e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchTargetNFT()
  }, [contract])


  return (
    <div className={styles.container}>
      <MenuBar />
      {nft && <div className={styles.detail}>
        <div className={styles.image}>
          <div className={styles.nft_image}>
            <Image src= {nft.image} width={300}height={300} alt="" title="" />
          </div>
          <div>a</div>


        </div>
        <div className={styles.image_detail}>

          <div className={styles.top_8px}></div>
          <div className={styles.title}>{nft.name}</div>
          <div className={styles.author}>This is Description</div>
          <Row wrap="wrap" align="center" >
            <div className={styles.left_8px}></div>
            <Image className={styles.eth_logo} src={Ethereum_logo} width='28px'height='44px' alt="" title="" /> <div className={styles.left_8px}></div><div className={styles.price}>{nft.price}ETH</div>
          </Row>
          <div className={styles.top_16px}></div>
          <Row wrap="wrap" align="center" >
            <Image className={styles.jpyc_logo} src={JPYC_logo} width='44px'height='44px' alt="" title="" /><div className={styles.price}>{Math.floor(nft.jpycPrice)}JPYC</div>
          </Row>
          <div className={styles.top_16px}></div>
          <div className={styles.top_16px}></div>
          <PurchaseModal nft={nft}/>

          <div className={styles.top_64px}></div>


        </div>
      </div>}
    </div>

  )
}

export default Detail
