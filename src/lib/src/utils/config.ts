const TokenSymbol = {
  WETH: 'WETH',
  USDC: 'USDC',
  MATIC: 'MATIC',
  USDT: 'USDT',
}
export type TokenSymbol = typeof TokenSymbol[keyof typeof TokenSymbol];

export const chainParameter = {
  // Ethereum
  '0x1': {
    chainId: 1,
    acceptableToken: [TokenSymbol.WETH, TokenSymbol.USDC, TokenSymbol.USDT],
  },
  // Polygon
  '0x89': {
    chainId: 137,
    acceptableToken: [TokenSymbol.MATIC, TokenSymbol.USDC],
  },
  // Goerli Test Network
  '0x5': {
    chianId: 5,
  },
  // Binance Smart Chain Test Network
  '0x61': {
    chianId: 97,
  },
}

const getTokenAddress = (symbol: TokenSymbol) => {
  switch (symbol) {
    case 'WETH':
      return '0x81ECac0D6Be0550A00FF064a4f9dd2400585FE9c'
    case 'USDC':
      return '0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98'
    case 'MATIC':
      return '0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF'
    case 'USDT':
      return '0x3795C36e7D12A8c252A20C5a7B455f7c57b60283'
    default:
      break
  }
}
