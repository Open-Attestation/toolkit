import { utils } from "@govtechsg/open-attestation";
import React, { useEffect, useState } from "react";
import { FailedAlert, SucceedAlert } from "../components/alert";

type Version = utils.Version;
type Kind = "wrapped" | "signed";
export const Diagnose: React.FunctionComponent = () => {
  const [rawDocument, setRawDocument] = useState("");
  const [version, setVersion] = useState<Version>("2.0");
  const [kind, setKind] = useState<Kind>("wrapped");
  const [errors, setErrors] = useState<{ message: string; keyword?: string }[]>([]);
  useEffect(() => {
    try {
      JSON.parse(rawDocument);
    } catch {
      setErrors([{ message: "This is not a valid certificate" }]);
      return;
    }

    if (rawDocument) {
      setErrors(
        utils.diagnose({
          version,
          kind,
          debug: false,
          document: JSON.parse(rawDocument),
          mode: "strict",
        })
      );
    }
  }, [kind, rawDocument, version]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl mb-4">Diagnose an OpenAttestation document</h1>
      <div>
        <button
          className={`btn-blue-small font-bold mb-2 mr-1 ${version === "2.0" ? "selected" : "unselected"}`}
          onClick={async () => {
            setVersion("2.0");
          }}
        >
          v2.0
        </button>
        <button
          className={`btn-blue-small font-bold mb-2 mr-1 ${version === "3.0" ? "selected" : "unselected"}`}
          onClick={async () => {
            setVersion("3.0");
          }}
        >
          v3.0
        </button>
        <button
          className={`btn-blue-small font-bold mb-2 mr-1 ${version === "4.0" ? "selected" : "unselected"}`}
          onClick={async () => {
            setVersion("4.0");
          }}
        >
          v4.0
        </button>
      </div>
      <div>
        <button
          className={`btn-blue-small font-bold mb-2 mr-1 ${kind === "wrapped" ? "selected" : "unselected"}`}
          onClick={async () => {
            setKind("wrapped");
          }}
        >
          Wrapped
        </button>
        <button
          className={`btn-blue-small font-bold mb-2 mr-1 ${kind === "signed" ? "selected" : "unselected"}`}
          onClick={async () => {
            setKind("signed");
          }}
        >
          Signed
        </button>
      </div>
      <textarea
        className="w-full px-3 py-2 text-gray-800 border-2 rounded-lg focus:shadow-outline"
        onChange={(e) => setRawDocument(e.target.value)}
        placeholder="Paste a document to get the status"
        rows={10}
        value={rawDocument}
      />
      {rawDocument && errors.length === 0 && <SucceedAlert>Document is valid</SucceedAlert>}
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
    </div>
  );
};
