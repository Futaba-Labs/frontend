import type {NextPage} from 'next'
import styles from '../styles/Menu.module.css'
import {Button, Row, Text} from '@nextui-org/react'
import ConnectWallet from './ConnectWallet'
import { useWeb3 } from '@/hooks/useWeb3'

const Menu: NextPage = () => {
  const {setVisible} = useWeb3()
  
  return (
    <div className={styles.container}>
      <div className={styles.top_16px}></div>
      <Row justify='space-between' className={styles.menu_row}>
        <div className={styles.menu_contents}>
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
        <Button rounded auto css={{backgroundColor: '#12eb27'}} shadow onClick={() => setVisible(true)}>
          Current Status
        </Button>
      </Row>

    </div>
  )
}

export default Menu
