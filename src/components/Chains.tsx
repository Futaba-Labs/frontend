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
      // you can also create your own color
      myDarkColor: '#ff4ecd'}
    }
  });
  const myTheme = createTheme({
    type:"dark",
    theme: {
      colors: {
        backcolor:"#383838",
        waring:"#333333",
        primary: '#383838',
      },

      // ...
    }
  });

  const [selected, setSelected] = React.useState(new Set(["select"]));
  const selectedValue = React.useMemo(
    () => Array.from(selected).join(", ").replaceAll("_", " "),
    [selected]
  );

  return (
  
    <NextUIProvider theme={darkTheme}>
    <Dropdown >
    <div className={myTheme}>
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
    </div>
    <Dropdown.Menu color="primary" 
      aria-label="Single selection actions"
      disallowEmptySelection
      selectionMode="single"
      selectedKeys={selected}
      onSelectionChange={setSelected}
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


    </Dropdown.Menu>
  </Dropdown>
  </NextUIProvider>
  
  )
}

export default ChainSelect
