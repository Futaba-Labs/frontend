import React, { useEffect } from 'react'
import {Modal, Input, Row, Checkbox, Button, Text} from '@nextui-org/react'
import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/ConnectWallet.module.css'
import metamask from '../images/MetaMask_Fox1.png'
import { useWeb3 } from '@/hooks/useWeb3'


const ConnectWallet: NextPage = () => {
  const {connectWallet, provider} = useWeb3()
  const [visible, setVisible] = React.useState(false)
  const handler = () => setVisible(true)
  const closeHandler = () => {
    setVisible(false)
  }

  useEffect(() => {
    if(provider) {
      setVisible(false)
    }
  }, [provider])

  return (
    <div>
      {!provider && <Button auto color="gradient" shadow onClick={handler}>
        ウォレットに接続
      </Button>}

      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>

            <Text className={styles.header} b size={24}>
              ウォレットを選択
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.top_32px}></div>
          <div className={styles.top_32px}></div>
          <Button bordered color="warning" auto onClick={() => connectWallet()}>
            Meta Mask<Image className={styles.metamask} width={30}height={30} src={metamask}></Image>
          </Button>
          <div className={styles.top_32px}></div>
          <div className={styles.top_32px}></div>
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </div>
  )
}
export default ConnectWallet
