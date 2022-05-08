import type {NextPage} from 'next'
import styles from '../styles/Menu.module.css'
import {Row, Text} from '@nextui-org/react'
import ConnectWallet from './ConnectWallet'

const Menu: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.top_16px}></div>
      <Row justify='space-between' className={styles.menu_row}>
        <div className={styles.menu_contents}>
          <Row>
            <a href='#'><Text color='#12eb27' className={styles.menu_text}></Text></a>
            <div className={styles.padding_left_16px}></div>
            <a href='#'> <Text color='#12eb27' className={styles.menu_text}></Text></a>
            <div className={styles.padding_left_16px}></div>
            <a href='#'><Text color='#12eb27' className={styles.menu_text}></Text></a>
          </Row>
        </div>
        <ConnectWallet />
      </Row>

    </div>
  )
}

export default Menu
