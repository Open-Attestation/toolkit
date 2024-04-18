import { networkCurrency, networkName, networkType } from "./network";

export enum CHAIN_ID {
  local = "1337",
  mainnet = "1",
  matic = "137",
  amoy = "80002",
  sepolia = "11155111",
}

export type chainInfo = {
  id: CHAIN_ID;
  label: string;
  name: networkName;
  type: networkType;
  currency: networkCurrency;
  explorerUrl: string;
  explorerApiUrl?: string;
  rpcUrl?: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
};

type supportedChains = Record<CHAIN_ID, chainInfo>;

export const SUPPORTED_CHAINS: supportedChains = {
  [CHAIN_ID.local]: {
    id: CHAIN_ID.local,
    label: "Local",
    name: "local",
    type: "development",
    currency: "ETH",
    explorerUrl: "https://localhost/explorer",
    rpcUrl: "http://localhost:8545",
  },
  [CHAIN_ID.mainnet]: {
    id: CHAIN_ID.mainnet,
    label: "Mainnet",
    name: "mainnet",
    type: "production",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    explorerApiUrl: "https://api.etherscan.io",
  },
  [CHAIN_ID.matic]: {
    id: CHAIN_ID.matic,
    label: "Polygon",
    name: "matic",
    type: "production",
    currency: "MATIC",
    explorerUrl: "https://polygonscan.com",
    rpcUrl: "https://polygon-rpc.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  [CHAIN_ID.amoy]: {
    id: CHAIN_ID.amoy,
    label: "Polygon Amoy",
    name: "amoy",
    type: "test",
    currency: "MATIC",
    explorerUrl: "https://www.oklink.com/amoy",
    explorerApiUrl: "https://api-amoy.polygonscan.com",
    rpcUrl: "https://rpc-amoy.polygon.technology",
    nativeCurrency: {
      name: "MATIC",
      symbol: "aMATIC",
      decimals: 18,
    },
  },
  [CHAIN_ID.sepolia]: {
    id: CHAIN_ID.sepolia,
    label: "Sepolia",
    name: "sepolia",
    type: "test",
    currency: "ETH",
    explorerUrl: "https://sepolia.etherscan.io",
    rpcUrl: "https://rpc.sepolia.org",
    nativeCurrency: {
      name: "ETH",
      symbol: "sepETH",
      decimals: 18,
    },
  },
};
