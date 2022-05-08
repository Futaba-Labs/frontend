import Button from '@/components/Button'
import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Menu.module.css'
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
import ConnectWallet from './ConnectWallet'

const Menu: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.top_16px}></div>
      <Row justify='space-between' className={styles.menu_row}>
        <div className={styles.menu_contents}>
          <Row>
            <a href='#'><Text color='#12eb27' className={styles.menu_text}>ドキュメント</Text></a>
            <div className={styles.padding_left_16px}></div>
            <a href='#'> <Text color='#12eb27' className={styles.menu_text}>ライブラリ</Text></a>
            <div className={styles.padding_left_16px}></div>
            <a href='#'><Text color='#12eb27' className={styles.menu_text}>私たちについて</Text></a>
          </Row>
        </div>
        <ConnectWallet />
      </Row>

    </div>
  )
}

export default Menu
