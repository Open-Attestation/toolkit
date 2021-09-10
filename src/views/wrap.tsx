import {
  getData,
  wrapDocument,
  utils,
  __unsafe__use__it__at__your__own__risks__wrapDocument as wrapDocumentV3,
} from "@govtechsg/open-attestation";
import React, { useEffect, useState } from "react";
import { FailedAlert, SucceedAlert } from "../components/alert";
import { Status } from "../shared";

type Version = "2.0" | "3.0";

export const Wrap: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState("");
  const [copied, setCopied] = useState<Status>("INITIAL");
  useEffect(() => {
    setCopied("INITIAL");
  }, [rawDocument]);
  const [version, setVersion] = useState<Version>("2.0");
  const [isToWrap, setIsToWrap] = useState<boolean>();
  const [errors, setErrors] = useState<{ message: string; keyword?: string }[]>([]);

  useEffect(() => {
    try {
      JSON.parse(rawDocument);
    } catch {
      setErrors([{ message: "This is not a valid certificate" }]);
      return;
    }

    if (rawDocument) {
      const isRawDocument =
        utils.isRawV2Document(JSON.parse(rawDocument)) || utils.isRawV3Document(JSON.parse(rawDocument));
      setIsToWrap(isRawDocument);
      setErrors(
        utils.diagnose({
          version,
          kind: isRawDocument ? "raw" : "wrapped",
          debug: false,
          document: JSON.parse(rawDocument),
          mode: "strict",
        })
      );
    }
  }, [rawDocument, version]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl mb-4">(Un)Wrap an OpenAttestation document</h1>
      <button
        className={`btn-blue-small font-bold mb-2 mr-1 ${version === "2.0" ? "selected" : "unselected"}`}
        onClick={async () => {
          setVersion("2.0");
        }}
      >
        {"2.0"}
      </button>
      <button
        className={`btn-blue-small font-bold mb-2 mr-1 ${version === "3.0" ? "selected" : "unselected"}`}
        onClick={async () => {
          setVersion("3.0");
        }}
      >
        {"3.0"}
      </button>
      <textarea
        className="w-full px-3 py-2 text-gray-800 border-2 rounded-lg focus:shadow-outline"
        onChange={(e) => setRawDocument(e.target.value)}
        placeholder="Paste a document and click on wrap/unwrap buttons to get the generated content copied into your clipboard"
        rows={10}
        value={rawDocument}
      />
      <button
        disabled={errors.length > 0 || !isToWrap}
        className="btn-primary"
        onClick={async () => {
          try {
            if (rawDocument) {
              navigator.clipboard
                .writeText(
                  JSON.stringify(
                    version === "2.0"
                      ? wrapDocument(JSON.parse(rawDocument))
                      : await wrapDocumentV3(JSON.parse(rawDocument)),
                    null,
                    2
                  )
                )
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
      {version !== "3.0" && ( // seems like no v3 unsalt yet
        <button
          disabled={errors.length > 0 || isToWrap}
          className="btn-primary"
          onClick={() => {
            try {
              if (rawDocument) {
                navigator.clipboard
                  .writeText(JSON.stringify(getData(JSON.parse(rawDocument)), null, 2))
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
      )}
      {rawDocument && errors.length !== 0 && (
        <FailedAlert>
          Document is not valid:
          <ul>
            {errors.map((error, index) => (
              <li key={index}>
                {error.keyword ? `${error.keyword} - ` : ""}
                {error.message}
              </li>
            ))}
          </ul>
        </FailedAlert>
      )}
      {copied === "SUCCEED" && <SucceedAlert>Copied to clipboard!</SucceedAlert>}
      {copied === "FAILED" && <FailedAlert>Unable to copy to clipboard!</FailedAlert>}
    </div>
  );
};
