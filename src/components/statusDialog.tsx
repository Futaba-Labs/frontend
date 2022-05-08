import {TransactionStatus} from '@/types/utilTypes'
import {Col, Divider, Loading, Modal, Row} from '@nextui-org/react'
import {NextPage} from 'next'
import {useEffect, useState} from 'react'
import Image from 'next/image'
import MATIC from '../images/currency/matic.png'
import ASTR from '../images/currency/astar_logo.png'
import POLYGON_USDC from '../images/currency/polygon_usdc.png'
import ASTAR_USDC from '../images/currency/astar_usdc.png'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import {useWeb3} from '@/hooks/useWeb3'


interface Props {
  transactionStatuses: TransactionStatus[]
  visible: boolean
  onClose: () => void
}

const StatusDialog: NextPage<Props> = (props) => {
  const {provider, transactionStatuses, setTransactionStatuses, visible, setVisible} = useWeb3()


  const [length, setLength] = useState(0)
  useEffect(() => {
    console.log(transactionStatuses)
    setLength(props.transactionStatuses.length)
  }, [props.transactionStatuses])

  return (
    <Modal
      closeButton
      blur
      aria-labelledby="modal-title"
      open={props.visible}
      onClose={() => props.onClose()}
      width={'500px'}
    >
      <Modal.Body>
        <p className="common_text">Status</p>
        <Row justify={'space-between'} align={'center'}>
          <Col><Image src={MATIC} width={50} height={50}/></Col>
          <Col >
            {length < 2 && <Loading type="points" color="success" css={{textAlign: 'center'}}/>}
            {length === 2 && <CheckCircleOutlineIcon sx={{backgroundColor: '#12eb27', textAlign: 'center'}}/>}
            <br/>
            <div className="top_padding_4"></div>
            {props.transactionStatuses.length > 0 && <a href={`https://polygonscan.com/tx/${props.transactionStatuses[0].transactionHash}`} target="_blank" rel="noreferrer">View Tx</a>}</Col>
          <Col><Image src={POLYGON_USDC} width={50} height={50}/></Col>
          <Col>
            {(length < 3 && length > 1) && <Loading type="points" color="success" css={{textAlign: 'center'}}/>}
            {length === 3 && <CheckCircleOutlineIcon sx={{backgroundColor: '#12eb27', textAlign: 'center'}}/>}
            {props.transactionStatuses.length > 1 && <a href={`https://polygonscan.com/tx/${props.transactionStatuses[1].transactionHash}`} target="_blank" rel="noreferrer">View Tx</a>}
          </Col>
          <Col><Image src={ASTAR_USDC} width={50} height={50}/></Col>
          <Col>
            {(length < 4 && length > 2) && <Loading type="points" color="success" css={{textAlign: 'center'}}/>}
            {length === 4 && <CheckCircleOutlineIcon sx={{backgroundColor: '#12eb27', textAlign: 'center'}}/>}
            {props.transactionStatuses.length > 2 && <a href={`https://blockscout.com/astar/tx/${props.transactionStatuses[2].transactionHash}`} target="_blank" rel="noreferrer">View Tx</a>}
          </Col>
          <Col><Image src={ASTR} width={50} height={50}/></Col>
        </Row>
        <div className="top_padding_8"></div>
      </Modal.Body>
    </Modal>
  )
}

export default StatusDialog
