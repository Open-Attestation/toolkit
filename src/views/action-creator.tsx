import React, { useEffect, useState } from "react";
import { FailedAlert, SucceedAlert } from "../components/alert";
import { Status } from "../shared";

const stringifyAndEncode = (obj: Record<string, unknown>): string => window.encodeURIComponent(JSON.stringify(obj));

export const ActionCreator: React.FunctionComponent = () => {
  const [action, setAction] = useState<string>("");
  const [verifier, setVerifier] = useState<string>("");
  const [documentUrl, setDocumentUrl] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [copied, setCopied] = useState<Status>("INITIAL");

  const buttonDisabled = !verifier || !documentUrl;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (copied !== "INITIAL") {
      timeout = setTimeout(() => {
        setCopied("INITIAL");
      }, 5000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl mb-4">Action Creator To Share OpenAttestation Document</h1>
      <div>
        <div>
          <label className="text-sm text-gray-900" htmlFor="verifier">
            Verifier:
          </label>
          <input
            placeholder="Verifier URL"
            className="w-full px-3 py-2 text-gray-800 border-2 rounded-lg focus:shadow-outline mb-2"
            id="verifier"
            value={verifier}
            onChange={(e) => setVerifier(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-900" htmlFor="url">
            Document URL:
          </label>
          <input
            placeholder="OpenAttestation Document URL"
            className="w-full px-3 py-2 text-gray-800 border-2 rounded-lg focus:shadow-outline mb-2"
            id="url"
            value={documentUrl}
            onChange={(e) => setDocumentUrl(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-900" htmlFor="key">
            Key:
          </label>
          <input
            placeholder="Document Decryption Key"
            className="w-full px-3 py-2 text-gray-800 border-2 rounded-lg focus:shadow-outline mb-2"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
        <div className="text-center">
          <button
            className={`btn-primary ${buttonDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
            onClick={() => {
              const newAction = stringifyAndEncode({
                type: "DOCUMENT",
                payload: {
                  uri: documentUrl,
                },
              });
              const anchor = key ? `#${stringifyAndEncode({ key })}` : ``;

              setAction(`${verifier}?q=${newAction}${anchor}`);
            }}
            disabled={buttonDisabled}
          >
            Create Action
          </button>
        </div>
        {action && (
          <div>
            <div>Click on the link to copy it!</div>
            <div
              className="underline font-bold text-sm border-2 border-black p-2 break-all bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => {
                navigator.clipboard
                  .writeText(action)
                  .then(() => {
                    setCopied("SUCCEED");
                  })
                  .catch(() => {
                    setCopied("FAILED");
                  });
              }}
            >
              {action}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4">
        {copied === "SUCCEED" && <SucceedAlert>Action Link copied to clipboard!</SucceedAlert>}
        {copied === "FAILED" && <FailedAlert>Unable to copy to clipboard!</FailedAlert>}
      </div>
    </div>
  );
};
