import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Ethereum_logo from '../images/ethereum_logo.png'
import JPYC_logo from '../images/jpyc_logo.png'
import styles from '../styles/NFTCard.module.css'
import {Card, Grid, Row, Text} from '@nextui-org/react'
import {useRouter} from 'next/router'
import {useContract} from '@/hooks/useContract'
import {useEffect, useState} from 'react'
import {NFT} from '@/types/web3Types'
import {useWeb3} from '@/hooks/useWeb3'
import {JPYCSwap} from '@t_adachi/jpyc-swap'

const NFTCard: NextPage = () => {
  const router = useRouter()
  const [isLoading, setisLoading] = useState(false)
  const [nfts, setNFTs] = useState<NFT[]>([])
  const contract = useContract()
  const {provider} = useWeb3()

  const handleClick = (nft: NFT) => {
    console.log(nft.tokenId)
    router.push({pathname: '/detail', query: {id: nft.tokenId}})
  }

  const fetchNFT = async () => {
    try {
      if (contract) {
        setisLoading(true)
        setNFTs([])
        const jpycSwap = new JPYCSwap(provider!, 4)
        const items = await contract.fetchMarketItems()
        items.map(async (item: any) => {
          console.log('hju')
          const tokenId = item.tokenId
          const tokenURI = await contract.tokenURI(tokenId)
          const list: NFT[] = nfts
          const jpycPrice = await jpycSwap.showPrice(parseInt(item.price._hex))
          list.push({tokenId: parseInt(tokenId._hex).toString(), name: 'test', price: parseInt(item.price._hex), jpycPrice: jpycPrice, image: tokenURI})
          setNFTs(list)
        })
        setisLoading(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  // const list = [
  //   {
  //     title: '作品A',
  //     author: 'Freedom Fashion',
  //     img: 'https://zukan.pokemon.co.jp/zukan-api/up/images/index/6f85978431106f04ac85dfea54541238.png',
  //     price: '$5.50',
  //   },
  //   {
  //     title: '作品A',
  //     author: 'Freedom Fashion',
  //     img: 'https://d2jzgjupsopjbp.cloudfront.net/client_info/SQEX_ESTORE/itemimage/CTR_P_BDQJ/FREE_ITEM115.jpg',
  //     price: '$5.50',
  //   },
  //   {
  //     title: '作品A',
  //     author: 'Freedom Fashion',
  //     img: 'https://zukan.pokemon.co.jp/zukan-api/up/images/index/9d8e5856660e43087ceb5856191f4fe7.png',
  //     price: '$5.50',
  //   },
  // ]


  useEffect(() => {
    fetchNFT()
  }, [contract])


  return (
    <div className={styles.container}>
      <div className={styles.card_row}>
        <Grid.Container gap={2} justify="space-between" >
          {nfts.map((nft, index) => (
            <Grid xs={6} sm={3} key={index}>
              <Card hoverable clickable onClick={() => handleClick(nft)} >
                <Card.Body css={{p: 0}} >


                  <Card.Image
                    objectFit="cover"
                    src={nft.image}
                    width={200}
                    height={200}
                    alt={nft.name}
                    className={styles.image}
                  />

                </Card.Body>

                <Card.Footer >

                  <Row wrap="wrap" justify="space-between">
                    <div>
                      <Text b className={styles.title}>{nft.name}</Text>
                      <div className={styles.author}>This is description</div>
                      <Row wrap="wrap" align="center" >
                        <Image className={styles.eth_logo} src={Ethereum_logo} width='14px'height='22px' alt="" title="" /><div className={styles.price}>{nft.price}ETH</div>
                      </Row>
                      <Row wrap="wrap" align="center" >
                        <Image src={JPYC_logo} width='22px'height='22px' alt="" title="" /><div className={styles.price}>{Math.floor(nft.jpycPrice)}JPYC</div>
                      </Row>
                    </div>
                  </Row>

                </Card.Footer>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
      </div>
    </div>
  )
}
export default NFTCard
