import { networkName } from "@govtechsg/tradetrust-utils/constants/network";
import { CHAIN_ID, SUPPORTED_CHAINS, chainInfo } from "@govtechsg/tradetrust-utils/constants/supportedChains";
import { isValid, openAttestationVerifiers, verificationBuilder, VerificationFragment } from "@govtechsg/oa-verify";
import { providers } from "ethers";
import React, { useEffect, useState } from "react";
import { FailedAlert, SucceedAlert } from "../components/alert";
import { Status } from "../shared";

const infuraProvider =
  (networkName: string): (() => providers.Provider) =>
  () =>
    new providers.InfuraProvider(networkName);

const jsonRpcProvider =
  (url: string): (() => providers.Provider) =>
  () =>
    new providers.JsonRpcProvider(url);

type supportedNetworks = Omit<Record<CHAIN_ID, chainInfo & { provider: () => providers.Provider }>, CHAIN_ID.local>;

const SUPPORTED_NETWORKS: supportedNetworks = {
  [CHAIN_ID.mainnet]: {
    ...SUPPORTED_CHAINS[CHAIN_ID.mainnet],
    provider: infuraProvider("homestead"),
  },
  [CHAIN_ID.matic]: {
    ...SUPPORTED_CHAINS[CHAIN_ID.matic],
    provider: infuraProvider("matic"),
  },
  [CHAIN_ID.maticmum]: {
    ...SUPPORTED_CHAINS[CHAIN_ID.maticmum],
    provider: infuraProvider("maticmum"),
  },
  [CHAIN_ID.sepolia]: {
    ...SUPPORTED_CHAINS[CHAIN_ID.sepolia],
    provider: jsonRpcProvider(SUPPORTED_CHAINS[CHAIN_ID.sepolia].rpcUrl as string),
  },
};

const networks = Object.values(SUPPORTED_NETWORKS);
const productionNetworks = networks.filter((item) => item.type === "production");
const testNetworks = networks.filter((item) => item.type === "test");

const NetworkButton: React.FunctionComponent<{
  isNetworkSelected: boolean;
  onNetworkClick: () => void;
  children: React.ReactNode;
}> = (props) => {
  const { isNetworkSelected, onNetworkClick, children } = props;
  return (
    <button
      className={`btn-blue-small font-bold mr-1 my-1 ${isNetworkSelected ? "selected" : "unselected"}`}
      onClick={onNetworkClick}
    >
      {children}
    </button>
  );
};

export const Verify: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState("");
  const [status, setStatus] = useState<Status>("INITIAL");
  useEffect(() => {
    setStatus("INITIAL");
  }, [rawDocument]);

  const [fragments, setFragments] = useState<VerificationFragment[]>([]);
  const [network, setNetwork] = useState<networkName>("sepolia");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl mb-4">Verify an OpenAttestation document</h1>
      <div className="flex flex-wrap items-center py-2">
        <p className="text-xs font-medium uppercase">Production:</p>
        <div className="w-full">
          {productionNetworks.map((chain) => {
            return (
              <NetworkButton
                key={chain.name}
                isNetworkSelected={chain.name === network}
                onNetworkClick={async () => {
                  setNetwork(chain.name);
                }}
              >
                {chain.label}
              </NetworkButton>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center py-2">
        <p className="text-xs font-medium uppercase">Testnets:</p>
        <div className="w-full">
          {testNetworks.map((chain) => {
            return (
              <NetworkButton
                key={chain.name}
                isNetworkSelected={chain.name === network}
                onNetworkClick={async () => {
                  setNetwork(chain.name);
                }}
              >
                {chain.label}
              </NetworkButton>
            );
          })}
        </div>
      </div>
      <textarea
        className="w-full px-3 py-2 my-2 text-gray-800 border-2 rounded-lg focus:shadow-outline"
        onChange={(e) => setRawDocument(e.target.value)}
        placeholder="Paste a document and click on verify button to get the status"
        rows={10}
        value={rawDocument}
      />
      <button
        className="btn-primary"
        onClick={async () => {
          try {
            if (rawDocument) {
              setStatus("PENDING");
              const supportedNetwork = networks.find((chain) => chain.name === network);

              if (supportedNetwork === undefined) {
                throw new Error("Supported network not found!");
              }

              const verify = verificationBuilder(openAttestationVerifiers, {
                provider: supportedNetwork.provider(),
              });

              const fragments = await verify(JSON.parse(rawDocument));
              setFragments(fragments);
              setStatus("SUCCEED");
            }
          } catch {
            setStatus("FAILED");
          }
        }}
      >
        {status === "PENDING" ? "Verifying" : "Verify"}
      </button>
      {status === "SUCCEED" && isValid(fragments) && <SucceedAlert>Document is valid</SucceedAlert>}
      {status === "SUCCEED" && !isValid(fragments) && (
        <FailedAlert>
          Document is not valid:
          <ul>
            <li>Document integrity: {String(isValid(fragments, ["DOCUMENT_INTEGRITY"]))}</li>
            <li>Document status: {String(isValid(fragments, ["DOCUMENT_STATUS"]))}</li>
            <li>Issuer identity: {String(isValid(fragments, ["ISSUER_IDENTITY"]))}</li>
          </ul>
        </FailedAlert>
      )}
      {status === "SUCCEED" && (
        <>
          <pre className="mt-2 text-left bg-white border-2 border-teal-600 whitespace-pre-wrap">
            {JSON.stringify(fragments, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
};
