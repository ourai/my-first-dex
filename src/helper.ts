import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, hardhat } from 'wagmi/chains'
import { Mainnet, Sepolia, Hardhat } from '@ant-design/web3-wagmi'

const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY

const etherscanApiUrlMap: Record<number, string> = {
  [mainnet.id]: mainnet.blockExplorers.default.apiUrl,
  [sepolia.id]: sepolia.blockExplorers.default.apiUrl,
}

const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  }
})

function getWagmiConfig() {
  return config
}

function getWagmiChains() {
  return [Mainnet, Sepolia, Hardhat]
}

function getEtherscanApiUrl(chainId: number): string {
  return etherscanApiUrlMap[chainId] || ''
}

export { ETHERSCAN_API_KEY, getWagmiConfig, getWagmiChains, getEtherscanApiUrl }
