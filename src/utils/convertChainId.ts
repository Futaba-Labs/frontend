export const restoreToGeneralChainId = (chainId: number) => {
  if (chainId === 9) {
    return 137
  } else if (chainId === 2) {
    return 56
  } else {
    return 0
  }
}
export const convertToStargateChainId = (chainId: number) => {
  if (chainId === 137) {
    return 9
  } else if (chainId === 56) {
    return 2
  } else {
    return 0
  }
}