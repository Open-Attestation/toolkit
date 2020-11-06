import { getData } from "@govtechsg/open-attestation";
import React, { useState } from "react";

export const Home: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState("");
  const [copied, setCopied] = useState(false);
  return (
    <>
      <div className="border-red-700 border">
        <textarea className="w-full" onChange={(e) => setRawDocument(e.target.value)} rows={30} value={rawDocument} />
      </div>
      <button
        onClick={() => {
          if (rawDocument) {
            navigator.clipboard.writeText(JSON.stringify(getData(JSON.parse(rawDocument)))).then(() => {
              setCopied(true);
            });
          }
        }}
      >
        Unwrap
      </button>
      {copied && "Copied to clipboard!"}
    </>
  );
};
