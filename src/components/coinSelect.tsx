import type {NextPage} from 'next'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import {Coin} from '@/types/utilTypes'
import {SetStateAction, useCallback, useState} from 'react'
import {Modal, Input, Row, Card, Button, Text, Divider, Col, Spacer} from '@nextui-org/react'
import {getCoinImage} from '@/utils/handleChainAndCoin'


interface Props {
  coinName: string
  currencies: Coin[]
  onChange: (coin: Coin) => void
}

const CoinSelect: NextPage<Props> = (props) => {
  const [visible, setVisible] = useState(false)
  const [tokenName, setTokenName] = useState('')

  const handler = () => setVisible(true)

  const closeHandler = () => {
    setVisible(false)
    console.log('closed')
  }

  const selectCoin = (currency: Coin) => {
    props.onChange(currency)
    closeHandler()
  }

  const inputTokenName = useCallback(
      (event: { target: { value: SetStateAction<string>; }; }) => {
        setTokenName(event.target.value)
      },
      [tokenName],
  )

  return (
    <>
      <div className={styles.src_chain_dropdown} onClick={handler}>
        <Row gap={0} className="top_padding_8">
          <Col>
            <Image src={getCoinImage(props.coinName)} width={60} height={60}/>
          </Col>
          <div className="left_padding_4"></div>
          <Col>
            <span className={styles.currency_name}>{props.coinName}</span>
          </Col>
          <Col>
            <ArrowDropDownIcon className='bottom_padding_8'/>
          </Col>
        </Row>
      </div>
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Body>
          <p>choose token</p>
          <Input
            clearable
            contentRightStyling={false}
            placeholder="token name or address"
            fullWidth={true}
            onChange={inputTokenName}
          />
          <div className={styles.coin_list}>
            {props.currencies.map((currency) => (
              <div onClick={() => selectCoin(currency)}>
                <Row justify={'space-between'} className="bottom_padding_8">
                  <Col>
                    <Row>
                      <Col><Image src={getCoinImage(currency.name)} width={30} height={30}/></Col>
                      <Col className="top_padding_8"><span>{currency.name}</span></Col>
                    </Row>
                  </Col>
                  <Spacer x={8}/>
                  <Col className="top_padding_8 text_right">
                    <span>0</span>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default CoinSelect
