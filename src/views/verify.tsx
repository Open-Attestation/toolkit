import { isValid, openAttestationVerifiers, verificationBuilder, VerificationFragment } from "@govtechsg/oa-verify";
import { providers } from "ethers";
import React, { useEffect, useState } from "react";
import { FailedAlert, SucceedAlert } from "../components/alert";
import { Status } from "../shared";

enum Network {
  mainnet,
  ropsten,
  rinkeby,
  goerli,
  matic,
  maticmum,
  sepolia,
}

type network = keyof typeof Network;

interface SupportedNetwork {
  label: string;
  network: network;
  type: "production" | "test";
  provider: () => providers.Provider;
}

const infuraProvider =
  (networkName: string): (() => providers.Provider) =>
  () =>
    new providers.InfuraProvider(networkName);

const jsonRpcProvider =
  (url: string): (() => providers.Provider) =>
  () =>
    new providers.JsonRpcProvider(url);

const supportedNetworks: Array<SupportedNetwork> = [
  {
    label: "Mainnet",
    network: "mainnet",
    type: "production",
    provider: infuraProvider("homestead"),
  },
  {
    label: "Goerli",
    network: "goerli",
    type: "test",
    provider: infuraProvider("goerli"),
  },
  {
    label: "Polygon",
    network: "matic",
    type: "production",
    provider: infuraProvider("matic"),
  },
  {
    label: "Polygon Mumbai",
    network: "maticmum",
    type: "test",
    provider: infuraProvider("maticmum"),
  },
  {
    label: "Sepolia",
    network: "sepolia",
    type: "test",
    provider: jsonRpcProvider("https://rpc.sepolia.org"),
  },
  {
    label: "Ropsten",
    network: "ropsten",
    type: "test",
    provider: infuraProvider("ropsten"),
  },
  {
    label: "Rinkeby",
    network: "rinkeby",
    type: "test",
    provider: infuraProvider("rinkeby"),
  },
];

const productionNetworks = supportedNetworks.filter((item) => item.type === "production");
const testNetworks = supportedNetworks.filter((item) => item.type === "test");

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
  const [network, setNetwork] = useState<network>("goerli");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl mb-4">Verify an OpenAttestation document</h1>
      <div className="flex flex-wrap items-center py-2">
        <p className="text-xs font-medium uppercase">Production:</p>
        <div className="w-full">
          {productionNetworks.map((item) => {
            return (
              <NetworkButton
                key={item.network}
                isNetworkSelected={item.network === network}
                onNetworkClick={async () => {
                  setNetwork(item.network);
                }}
              >
                {item.label}
              </NetworkButton>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center py-2">
        <p className="text-xs font-medium uppercase">Testnets:</p>
        <div className="w-full">
          {testNetworks.map((item) => {
            return (
              <NetworkButton
                key={item.network}
                isNetworkSelected={item.network === network}
                onNetworkClick={async () => {
                  setNetwork(item.network);
                }}
              >
                {item.label}
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
              const supportedNetwork = supportedNetworks.find((item) => item.network === network);

              if (supportedNetwork === undefined) {
                throw new TypeError("Supported network not found!");
              }

              const provider = supportedNetwork?.provider;
              const verify = verificationBuilder(openAttestationVerifiers, {
                provider: provider(),
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
