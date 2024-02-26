import { networkCurrency, networkName, networkType } from "./network";

export declare enum CHAIN_ID {
  local = "1337",
  mainnet = "1",
  matic = "137",
  maticmum = "80001",
  sepolia = "11155111",
}

export type chainInfo = {
  id: CHAIN_ID;
  label: string;
  name: networkName;
  type: networkType;
  currency: networkCurrency;
  iconImage: string;
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
export declare const SUPPORTED_CHAINS: supportedChains;
export {};
