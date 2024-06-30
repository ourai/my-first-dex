import { useState } from 'react'
import { Button, Flex } from 'antd'
import { SwapOutlined } from '@ant-design/icons'
import { CryptoInput, type CryptoInputProps } from '@ant-design/web3'
import { ETH, USDT } from '@ant-design/web3-assets'

import style from './style.module.scss'

type CryptoValue = CryptoInputProps['value']

const TOKEN_LIST = [ETH, USDT]

function Swapper() {
  const [tokenPair, setTokenPair] = useState<CryptoValue[]>([{}, {}])

  const handleSwap = () => {
    setTokenPair([tokenPair[1], tokenPair[0]])
  }

  const handleSubmit = () => {
    console.log(tokenPair)
  }

  return (
    <Flex className={style.Swapper} align="center" gap={16} vertical>
      <CryptoInput value={tokenPair[0]} footer={false} tokenList={TOKEN_LIST} onChange={crypto => setTokenPair([crypto, tokenPair[1]])} />
      <span className={style['Swapper-swapButton']} onClick={handleSwap}><SwapOutlined className={style['Swapper-swapIcon']} /></span>
      <CryptoInput value={tokenPair[1]} footer={false} tokenList={TOKEN_LIST} onChange={crypto => setTokenPair([tokenPair[0], crypto])} />
      <Button
        className={style['Swapper-confirmButton']}
        type="primary"
        size="large"
        disabled={!tokenPair[0]?.amount || !tokenPair[1]?.amount}
        onClick={handleSubmit}
      >
        Swap
      </Button>
    </Flex>
  )
}

export default Swapper
