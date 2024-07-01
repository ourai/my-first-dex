import axios from 'axios'
import { CurrencyAmount } from '@uniswap/sdk-core'
import { Pair, Route } from '@uniswap/v2-sdk'
import { readContract } from '@wagmi/core'
import { parseUnits } from 'viem'
import { multiply } from '@ntks/toolbox'

import { ETHERSCAN_API_KEY, getWagmiConfig, getEtherscanApiUrl } from '../../helper'
import type { CryptoValue, UniswapToken, ContractAddress, ContractAbi } from './typing'
import { resolveUniswapToken } from './helper'

const cachedAbiMap: Record<ContractAddress, ContractAbi> = {}

async function getContractAbiByAddress(chainId: number, address: ContractAddress): Promise<ContractAbi> {
  if (cachedAbiMap[address]) {
    return cachedAbiMap[address]
  }

  const { status, data } = await axios.get(getEtherscanApiUrl(chainId), {
    params: {
      module: 'contract',
      action: 'getabi',
      address,
      apikey: ETHERSCAN_API_KEY,
    }
  })

  if (status !== 200 || data.status !== '1') {
    return []
  }

  const abi = JSON.parse(data.result)

  cachedAbiMap[address] = abi

  return abi
}

async function getSwappedTokenPair(chainId: number, pair: CryptoValue[]): Promise<CryptoValue[]> {
  const tokens = pair.map(crypto => resolveUniswapToken(crypto, chainId)).filter(token => !!token) as UniswapToken[]

  if (tokens.length < 2) {
    return pair
  }

  const pairAddr = Pair.getAddress(tokens[0], tokens[1]) as ContractAddress
  const abi = await getContractAbiByAddress(chainId, pairAddr)

  const [reserve0, reserve1] = await readContract(getWagmiConfig(), { address: pairAddr, abi, functionName: 'getReserves' })
  const [token0, token1] = tokens[0].sortsBefore(tokens[1]) ? tokens : [tokens[1], tokens[0]]

  const uniswapPair = new Pair(CurrencyAmount.fromRawAmount(token0, `${reserve0}`), CurrencyAmount.fromRawAmount(token1, `${reserve1}`))
  const uniswapRoute = new Route([uniswapPair], tokens[0], tokens[1])

  const [source, target] = pair
  const relatedAmount = uniswapRoute.midPrice.toSignificant(6)
  const swappedAmount = `${multiply(Number(relatedAmount), Number(source!.inputString))}`

  return [source, { ...target, inputString: swappedAmount, amount: parseUnits(swappedAmount, target!.token!.decimal) }]
}

export { getSwappedTokenPair }
