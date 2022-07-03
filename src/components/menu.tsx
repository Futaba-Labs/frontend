import type {NextPage} from 'next'
import styles from '../styles/Menu.module.css'
import {Button, Row, Text} from '@nextui-org/react'
import ConnectWallet from './ConnectWallet'
import { useWeb3 } from '@/hooks/useWeb3'
import logo from '../images/futaba_logo.png'
import Image from 'next/image'

const Menu: NextPage = () => {
  const {setVisible} = useWeb3()
  
  return (
    <div className={styles.container}>
      <div className={styles.top_16px}></div>
      <Row justify='space-between' align='flex-start' className={styles.menu_row}>
        <div className={styles.menu_contents}>
          <div className={styles.padding_left_16px}></div>
        <Row>
        <Image src={logo} width={50} height={50} className={styles.logo}/>
        <div className={styles.padding_left_16px}></div><div className={styles.padding_left_16px}></div>
          <p className={styles.menu_text}>swap</p>
          <div className={styles.padding_left_16px}></div><div className={styles.padding_left_16px}></div>
          <p className={styles.menu_text}>community</p>
          <div className={styles.padding_left_16px}></div><div className={styles.padding_left_16px}></div>
          <p className={styles.menu_text}>about us</p></Row>
          <Row>
            {/* <a href='#'><Text color='#12eb27' className={styles.menu_text}></Text></a>
            <div className={styles.padding_left_16px}></div>
            <a href='#'> <Text color='#12eb27' className={styles.menu_text}></Text></a>
            <div className={styles.padding_left_16px}></div>
            <a href='#'><Text color='#12eb27' className={styles.menu_text}></Text></a> */}
          </Row>
        </div>
       
        <ConnectWallet />
        <div className="left_padding_4"></div>
        <Button rounded auto color='success' css={{backgroundColor: '#12eb27'}} shadow onClick={() => setVisible(true)}>
          Current Status
        </Button>
      </Row>

    </div>
  )
}

export default Menu
