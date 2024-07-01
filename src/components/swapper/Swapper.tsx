import { useState, useEffect } from 'react'
import { Button, Flex, Spin } from 'antd'
import { mainnet } from 'wagmi/chains'
import { SwapOutlined } from '@ant-design/icons'
import { CryptoInput } from '@ant-design/web3'
import { ETH, USDT } from '@ant-design/web3-assets'

import type { CryptoValue } from './typing'
import { isCryptoValid } from './helper'
import { getSwappedTokenPair } from './repository'
import style from './style.module.scss'

const TOKEN_LIST = [ETH, USDT]

function Swapper() {
  const [tokenPair, setTokenPair] = useState<CryptoValue[]>([{}, {}])
  const [swapping, setSwapping] = useState<boolean>(false)

  useEffect(() => {
    if (!swapping) {
      return
    }

    const [source, target] = tokenPair

    if (!isCryptoValid(source, true) || !isCryptoValid(target)) {
      return setSwapping(false)
    }

    getSwappedTokenPair(mainnet.id, tokenPair).then(pair => {
      setTokenPair(pair)
    }).finally(() => setSwapping(false))

    console.log('use effect', tokenPair)
  }, [tokenPair])

  const changeTokenPair = (pair: CryptoValue[]) => {
    setSwapping(true)
    setTokenPair(pair)
  }

  const handleSwap = () => {
    setSwapping(true)
    setTokenPair([tokenPair[1], tokenPair[0]])
  }

  const handleSubmit = () => {
    console.log(tokenPair)
  }

  return (
    <Spin spinning={swapping}>
      <Flex className={style.Swapper} align="center" gap={16} vertical>
        <CryptoInput value={tokenPair[0]} footer={false} tokenList={TOKEN_LIST} onChange={crypto => changeTokenPair([crypto, tokenPair[1]])} />
        <span className={style['Swapper-swapButton']} onClick={handleSwap}><SwapOutlined className={style['Swapper-swapIcon']} /></span>
        <CryptoInput value={tokenPair[1]} footer={false} tokenList={TOKEN_LIST} onChange={crypto => changeTokenPair([tokenPair[0], crypto])} />
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
    </Spin>
  )
}

export default Swapper
