import { getData, wrapDocument } from "@govtechsg/open-attestation";
import React, { useEffect, useState } from "react";
import { FailedAlert, SucceedAlert } from "../components/alert";
import { Status } from "../shared";

export const Wrap: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState("");
  const [copied, setCopied] = useState<Status>("INITIAL");
  useEffect(() => {
    setCopied("INITIAL");
  }, [rawDocument]);
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl mb-4">(Un)Wrap an OpenAttestation document</h1>
      <textarea
        className="w-full px-3 py-2 text-gray-800 border-2 rounded-lg focus:shadow-outline"
        onChange={(e) => setRawDocument(e.target.value)}
        placeholder="Paste a document and click on wrap/unwrap buttons to get the generated content copied into your clipboard"
        rows={10}
        value={rawDocument}
      />
      <button
        className="btn-primary"
        onClick={() => {
          try {
            if (rawDocument) {
              navigator.clipboard
                .writeText(JSON.stringify(wrapDocument(JSON.parse(rawDocument))))
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
        Wrap
      </button>
      <button
        className="btn-primary"
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
