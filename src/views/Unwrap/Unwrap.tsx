import { getData } from "@govtechsg/open-attestation";
import React, { useEffect, useState } from "react";

const FailedAlert: React.FunctionComponent = ({ children }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">{children}</strong>
  </div>
);

const SucceedAlert: React.FunctionComponent = ({ children }) => (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">{children}</strong>
  </div>
);

type Status = "INITIAL" | "SUCCEED" | "FAILED";
export const Unwrap: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState("");
  const [copied, setCopied] = useState<Status>("INITIAL");
  useEffect(() => {
    setCopied("INITIAL");
  }, [rawDocument]);
  return (
    <div className="container mx-auto py-6 text-center">
      <h1 className="text-3xl mb-4">Unwrap an OpenAttestation document</h1>
      <textarea
        className="w-full px-3 py-2 text-gray-800 border-2 rounded-lg focus:shadow-outline"
        onChange={(e) => setRawDocument(e.target.value)}
        placeholder="Paste a wrapped document and click on Unwrap to get the initial document copied into your clipboard"
        rows={10}
        value={rawDocument}
      />
      <button
        className="hover:bg-transparent bg-teal-500 hover:text-teal-700 font-semibold text-white py-2 px-4 border hover:border-teal-500 border-transparent rounded mb-2"
        onClick={() => {
          try {
            if (rawDocument) {
              navigator.clipboard
                .writeText(JSON.stringify(getData(JSON.parse(rawDocument))))
                .then(() => {
                  setCopied("SUCCEED");
                })
                .catch(() => {
                  setCopied("FAILED");
                });
            }
          } catch {
            setCopied("FAILED");
          }
        }}
      >
        Unwrap
      </button>
      {copied === "SUCCEED" && <SucceedAlert>Copied to clipboard!</SucceedAlert>}
      {copied === "FAILED" && <FailedAlert>Unable to copy to clipboard!</FailedAlert>}
    </div>
  );
};
