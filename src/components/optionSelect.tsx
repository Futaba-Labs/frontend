import type {NextPage} from 'next'
import Image from 'next/image'
import styles from '../styles/optionSelect.module.css'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import {Coin} from '@/types/utilTypes'
import {SetStateAction, useCallback, useState} from 'react'
import {Modal, Input, Row, Card, Button, Text, Divider, Col, Spacer, Checkbox, Radio, createTheme, NextUIProvider} from '@nextui-org/react'
import {getCoinImage} from '@/utils/handleChainAndCoin'

interface Props {}

const OptionSelect: NextPage<Props> = (props) => {
  const [visible, setVisible] = useState(false)
  const [tokenName, setTokenName] = useState('')

  const handler = () => setVisible(true)

  const closeHandler = () => {
    setVisible(false)
    console.log('closed')
  }

  const darkTheme = createTheme({
    type: "dark",
    theme: {
      colors: { background: '#1d1d1d',
      text: '#fff',
      warning:'#000000',
      // you can also create your own color
      myDarkColor: '#ff4ecd'}
    }
  });



  return (
    <div>
        <NextUIProvider theme={darkTheme}>
      <Button auto color="warning"   onClick={handler}>
        ⚙
      </Button>
      </NextUIProvider>
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Option to
            <Text b size={18}>
               Transaction
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>

        <Radio.Group label="Options(under development)" defaultValue="1">
      <Radio value="1" description="Choose the most fastest transaction">
        Konoha🍃
      </Radio>
      <Radio value="2" description="Choose best value transaction">
        Inaho🌾
      </Radio>
      <Radio value="3" description="Choose the most cheepest transaction">
        Kaede🍁
      </Radio>
    </Radio.Group>
        </Modal.Body>

      </Modal>
    </div>
  )
}

export default OptionSelect
