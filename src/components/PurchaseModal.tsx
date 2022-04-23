import React from 'react'
import {Modal, Input, Row, Checkbox, Button, Text} from '@nextui-org/react'
import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/PurchaseModal.module.css'
import { NFT } from '@/types/web3Types'
import { JPYCSwap } from '@/utils/jpycSwap'
import { useWeb3 } from '@/hooks/useWeb3'
import { useContract } from '@/hooks/useContract'

interface Props {
  nft: NFT
}

const PurchaseModal: NextPage<Props> = (props) => {
  const [visible, setVisible] = React.useState(false)
  const {provider} = useWeb3()
  const contract = useContract()

  const handler = () => setVisible(true)
  const closeHandler = () => {
    setVisible(false)
    console.log('closed')
  }
  const purchase = async () => {
    if(provider && contract) {
      const jpycSwap = new JPYCSwap(provider, 4)
      await jpycSwap.swap(props.nft.price)
      try {
        console.log('testetts')
        const tx = await contract.createMarketSale(props.nft.tokenId);
          console.log('Waiting...')
          await tx.wait()
          console.log(tx)
      } catch(e) {
        console.error(e);
      }
    }
  }

  return (
    <div>
      <Button auto color="gradient" shadow onClick={handler}>
        JPYCで購入する
      </Button>
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
              購入確認
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Row justify="space-around">
            <div className={styles.image_box}>
              <Image src= {props.nft.image} width={100} height={100} objectFit="fill" alt="" title="" />
            </div>
            <div>

              <Text className={styles.title}>{props.nft.name}</Text>

              <Text className={styles.price}>予想価格</Text>
              <Text className={styles.price}>{Math.floor(props.nft.jpycPrice)} JPYC</Text>


            </div>
          </Row>
          <Row justify="space-between">
            <Checkbox>
              <Text size={14}>外部サービスを利用し、値段に差があることに同意します</Text>
            </Checkbox>
          </Row>

        </Modal.Body>
        <Modal.Footer>
          <Button auto ghost color="error" onClick={closeHandler}>
            Close
          </Button>
          <Button auto color="gradient" onClick={purchase}>
            購入する
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
export default PurchaseModal
