import MATIC from '../images/currency/matic.png'
import USDC from '../images/currency/usdc.png'
import USDT from '../images/currency/tether.png'
import DAI from '../images/currency/dai.png'
import ASTR from '../images/currency/astar_logo.png'
import POLYGON from '../images/chain/polygon_logo.png'
import BNB from '../images/currency/binance_logo.png'
import { ButtonBase } from '@mui/material'


export const getCoinImage = (coinName: string): string => {
  switch (coinName) {
    case 'MATIC':
      return MATIC.src
    case 'USDC':
      return USDC.src
    case 'USDT':
      return USDT.src
    case 'DAI':
      return DAI.src
    case 'ASTR':
      return ASTR.src
    case 'BNB':
      return BNB.src
    default:
      return ''
  }
}

export const getChainImage = (chainId: number): string => {
  switch (chainId) {
    case 137:
      return POLYGON.src
    case 592:
      return ASTR.src
    default:
      return ''
  }
}
