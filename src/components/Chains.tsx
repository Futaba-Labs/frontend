import type {NextPage} from 'next'
import React from "react";
import Image from 'next/image'
import styles from '../styles/Chain.module.css'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import {Container, Spacer,Dropdown,createTheme,NextUIProvider} from '@nextui-org/react'
import {Chain} from '@/types/utilTypes'
import {getChainImage} from '@/utils/handleChainAndCoin'
import { AddNoteIcon } from './AddNoteIcon'
import { style } from '@mui/system'
import matic from '../images/currency/matic.png'

interface Props {
  chain: Chain
  onChange: (chain: Chain) => void
}


const ChainSelect: NextPage<Props> = (props) => {

  const darkTheme = createTheme({
    type: "dark",
    theme: {
      colors: { background: '#1d1d1d',
      text: '#fff',
      primary:'#383838',
      // you can also create your own color
      myDarkColor: '#ff4ecd'}
    }
  });


  const [selected, setSelected] = React.useState(new Set(["Polygon"]));
  const selectedValue = React.useMemo(
    () => Array.from(selected).join(", ").replaceAll("_", " "),
    [selected]
  );

  return (
  
    <NextUIProvider theme={darkTheme}>
    <Dropdown >
    <Dropdown.Button color="primary" >
      <div className={styles.chain_box}>
      <div className={styles.chain_icon}>
      <Image src={matic} width={20} height={20} alt="aa" />
      </div>
        <div className={styles.chain_name}>
     
           {selectedValue}
        </div>
      
      </div>
    </Dropdown.Button>

    <Dropdown.Menu color="primary" 
      aria-label="Single selection actions"
      disallowEmptySelection
      selectionMode="single"
      selectedKeys={selected}
      onSelectionChange={(key) => console.log(key.valueOf())}
    css={{ $$dropdownMenuWidth: "360px" }}>

    <Dropdown.Item
          key="Polygon"
          command="mainnet"
        >
        Polygon

      </Dropdown.Item>
      <Dropdown.Item
        key="BSC"
        command="mainnet"
      >
        BSC
      </Dropdown.Item>
      <Dropdown.Item
        key="Avalanche"
        command="test"
        css={{color:'#383838'}}
      >
        Avalanche
      </Dropdown.Item>
      <Dropdown.Item
        key="Ethereum"
        command="test"
        css={{color:'#383838'}}
      >
        Ethereum
      </Dropdown.Item>
      <Dropdown.Item
        key="Astar Network"
        command="test"
        css={{color:'#383838'}}
      >
        Astar Network
      </Dropdown.Item>
      <Dropdown.Item
        key="Arbitrum"
        command="test"
        css={{color:'#383838'}}
      >
        Arbitrum
      </Dropdown.Item>


    </Dropdown.Menu>
  </Dropdown>
  </NextUIProvider>
  
  )
}

export default ChainSelect
