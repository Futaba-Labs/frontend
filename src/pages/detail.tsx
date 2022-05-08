import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Detail.module.css'
import menubar from '../images/menu.png'
import nft from '../images/NFT-1.png'
import {Button, Card, Grid, Modal, Row, Text} from '@nextui-org/react'
import Ethereum_logo from '../images/ethereum_logo.png'
import JPYC_logo from '../images/jpyc_logo.png'
import {height, style} from '@mui/system'
import Title from '@/components/Title'
import Heading from '@/components/Heading'
import NFTCard from '@/components/NFTCard'
import PurchaseModal from '@/components/PurchaseModal'
import MenuBar from '@/components/MenuBar'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useContract} from '@/hooks/useContract'
import {NFT} from '@/types/web3Types'
import {JPYCSwap} from '@t_adachi/jpyc-swap'
import {useWeb3} from '@/hooks/useWeb3'
import FUTABA from '../images/futaba.png'
import ASTR from '../images/currency/astar_logo.png'
import SwapCard from '@/components/swapCard'


const Detail: NextPage = () => {
  const router = useRouter()
  const result: string = router.query.id as string
  const [nft, setNFT] = useState<NFT | null>(null)
  const [visible, setVisible] = useState(false)

  const handler = () => {
    setVisible(true)
  }

  const closeHandler = () => {
    setVisible(false)
    console.log('closed')
  }

  // const fetchTargetNFT = async () => {
  //   try {
  //     if (contract) {
  //       setNFT(null)
  //       const items = await contract.fetchMarketItems()
  //       const jpycSwap = new JPYCSwap(provider!, 4)
  //       items.map(async (item: any) => {
  //         console.log(result)
  //         const tokenId = item.tokenId
  //         if (tokenId == result) {
  //           console.log('cxuwgiuc')
  //           const tokenURI = await contract.tokenURI(tokenId)
  //           const jpycPrice = await jpycSwap.showPrice(parseInt(item.price._hex))
  //           setNFT({tokenId: tokenId, name: 'test', price: parseInt(item.price._hex), jpycPrice: jpycPrice, image: tokenURI})
  //         }
  //       })
  //     }
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }


  return (
    <div className={styles.container}>
      <MenuBar />
      {true && <div className={styles.detail}>
        <div className={styles.image}>
          <div className={styles.nft_image}>
            <Image src= {FUTABA} width={300}height={300} alt="" title="" />
          </div>
          <div>a</div>


        </div>
        <div className={styles.image_detail}>

          <div className={styles.top_8px}></div>
          <div className={styles.title}>Futaba</div>
          <div className={styles.author}>Here is description...</div>
          <Row wrap="wrap" align="center" >
            <div className={styles.left_8px}></div>
            <Image className={styles.eth_logo} src={ASTR} width='44px'height='44px' alt="" title="" /> <div className={styles.left_8px}></div><div className={styles.price}>100ASTR</div>
          </Row>
          <div className={styles.top_16px}></div>
          <div className={styles.top_16px}></div>
          <div className={styles.top_16px}></div>

          <Button onClick={handler}>
        Buy
          </Button>
          <Modal
            closeButton
            blur
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
          ><Modal.Body>
              <div className={styles.swap_card}>
                <SwapCard/>
              </div>
            </Modal.Body>
          </Modal>


          <div className={styles.top_64px}></div>


        </div>
      </div>}
    </div>

  )
}

export default Detail
