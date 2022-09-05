import { isValid, openAttestationVerifiers, verificationBuilder, VerificationFragment } from "@govtechsg/oa-verify";
import { providers } from "ethers";
import React, { useEffect, useState } from "react";
import { FailedAlert, SucceedAlert } from "../components/alert";
import { Status } from "../shared";

enum SupportedNetwork {
  ropsten = "ropsten",
  homestead = "homestead",
  rinkeby = "rinkeby",
  goerli = "goerli",
  maticmum = "maticmum",
}

type Network = keyof typeof SupportedNetwork;

export const Verify: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState("");
  const [status, setStatus] = useState<Status>("INITIAL");
  useEffect(() => {
    setStatus("INITIAL");
  }, [rawDocument]);

  const [fragments, setFragments] = useState<VerificationFragment[]>([]);
  const [network, setNetwork] = useState<Network>(SupportedNetwork.ropsten);
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl mb-4">Verify an OpenAttestation document</h1>
      <button
        className={`btn-blue-small font-bold mb-2 mr-1 ${
          network === SupportedNetwork.ropsten ? "selected" : "unselected"
        }`}
        onClick={async () => {
          setNetwork(SupportedNetwork.ropsten);
        }}
      >
        Ropsten
      </button>
      <button
        className={`btn-blue-small font-bold mb-2 mr-1 ${
          network === SupportedNetwork.homestead ? "selected" : "unselected"
        }`}
        onClick={async () => {
          setNetwork(SupportedNetwork.homestead);
        }}
      >
        Mainnet
      </button>
      <button
        className={`btn-blue-small font-bold mb-2 mr-1 ${
          network === SupportedNetwork.rinkeby ? "selected" : "unselected"
        }`}
        onClick={async () => {
          setNetwork(SupportedNetwork.rinkeby);
        }}
      >
        Rinkeby
      </button>
      <button
        className={`btn-blue-small font-bold mb-2 mr-1 ${
          network === SupportedNetwork.goerli ? "selected" : "unselected"
        }`}
        onClick={async () => {
          setNetwork(SupportedNetwork.goerli);
        }}
      >
        Goerli
      </button>
      <button
        className={`btn-blue-small font-bold mb-2 mr-1 ${
          network === SupportedNetwork.maticmum ? "selected" : "unselected"
        }`}
        onClick={async () => {
          setNetwork(SupportedNetwork.maticmum);
        }}
      >
        Mumbai
      </button>
      <textarea
        className="w-full px-3 py-2 text-gray-800 border-2 rounded-lg focus:shadow-outline"
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
              const verify = verificationBuilder(openAttestationVerifiers, {
                provider: new providers.InfuraProvider(network),
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
