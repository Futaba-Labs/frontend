import type {NextPage} from 'next'
import Image from 'next/image'
import styles from '../styles/ChainSelect.module.css'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import {Container, Spacer, Dropdown } from '@nextui-org/react'
import {Chain} from '@/types/utilTypes'
import {getChainImage} from '@/utils/handleChainAndCoin'

interface Props {
  chain: Chain
  onChange: (chain: Chain) => void
}
const ChainSelect: NextPage<Props> = (props) => {
  return (
    <div className={styles.chain_dropdown} onClick={() => console.log('click')}>
      <Container gap={0} css={{d: 'flex', flexWrap: 'nowrap'}}>
        <Image src={getChainImage(props.chain.id)} width={27} height={27}/>
        <div className="left_padding_4"></div>
        <span className="top_padding_4">{props.chain.name}</span>
      </Container>
    </div>
  )
}

export default ChainSelect
