import { decryptString, encryptString, generateEncryptionKey } from "@govtechsg/oa-encryption";
import React, { useEffect, useState } from "react";
import { FailedAlert, SucceedAlert } from "../components/alert";
import { Status } from "../shared";

const stringifyAndEncode = (obj: Record<string, unknown>): string => window.encodeURIComponent(JSON.stringify(obj));

const SAMPLE = {
  q: {
    type: "DOCUMENT",
    payload: {
      uri: "https://api-vaccine.storage.staging.notarise.io/document/d0595f61-b493-4880-a748-f2de095405b1",
      permittedActions: ["VIEW", "STORE"],
      redirect: "https://www.verify.gov.sg/verify",
    },
  },
  anchor: { key: "ab8d3ff543ca89b775a559a6a3a92416ef971a16f7cbc38c0ce22488beff4b5f" },
};

const action = stringifyAndEncode(SAMPLE.q);
const anchor = stringifyAndEncode(SAMPLE.anchor);
const SAMPLE_ENCRYPTED_DOC = `https://action.openattestation.com?q=${action}#${anchor}`;

export const EncryptDecrypt: React.FunctionComponent = () => {
  const [key, setKey] = useState(generateEncryptionKey());
  const [rawDocument, setRawDocument] = useState("");
  const [url, setUrl] = useState(SAMPLE_ENCRYPTED_DOC);
  const [encryptedDocument, setEncryptedDocument] = useState("");
  const [isValid, setValid] = useState(true);
  const [noticeMsg, setNoticeMsg] = useState("");
  const [copied, setCopied] = useState<Status>("INITIAL");

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
      <h1 className="text-3xl mb-4">Encrypt/Decrypt an OpenAttestation document</h1>
      <div className="mb-4 mt-4">
        {copied === "SUCCEED" && <SucceedAlert>Key copied to clipboard!</SucceedAlert>}
        {copied === "FAILED" && <FailedAlert>Unable to copy the key to clipboard!</FailedAlert>}
      </div>
      <div className="flex mb-6">
        <div className="flex-1">
          <textarea
            className="w-full px-3 py-2 text-gray-800 font-mono border-2 rounded-lg focus:shadow-outline"
            onChange={(e) => setRawDocument(e.target.value)}
            placeholder="Paste a document"
            rows={20}
            value={rawDocument}
          />
          <div className="flex items-center">
            <label>Key:</label>
            <input
              className="w-full px-2 py-2 mx-2 bg-white opacity-60 font-mono text-xs border-2 rounded-lg focus:shadow-outline"
              value={key}
              disabled
            />
            <button className="btn-blue-small" onClick={() => setKey(generateEncryptionKey())}>
              Regenerate
            </button>
            <button
              className="ml-2 btn-blue-small"
              onClick={() => {
                navigator.clipboard
                  .writeText(key)
                  .then(() => {
                    setCopied("SUCCEED");
                  })
                  .catch(() => {
                    setCopied("FAILED");
                  });
              }}
            >
              Copy
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-center mx-4">
          <button
            className="btn-primary"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { key: _key, ...encryptedDocument } = encryptString(rawDocument, key);
              setEncryptedDocument(JSON.stringify(encryptedDocument, undefined, 2));
            }}
          >{`Encrypt >`}</button>
          <button
            className="btn-primary"
            onClick={() => {
              try {
                const encryptedDoc = JSON.parse(encryptedDocument);
                const missingKeys = ["cipherText", "iv", "tag", "key", "type"].filter((key) => !(key in encryptedDoc));
                if (missingKeys.length !== 0) {
                  throw new Error(`Missing ${missingKeys.toString()}`);
                }
                const decryptedDoc = JSON.parse(decryptString(encryptedDoc));
                setRawDocument(JSON.stringify(decryptedDoc, undefined, 2));
                setKey(encryptedDoc.key);
                setValid(true);
                setNoticeMsg("");
              } catch (e) {
                setValid(false);
                setNoticeMsg(`${e}`);
              }
            }}
          >{`< Decrypt`}</button>
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <label>URL:</label>
            <input
              className="w-full px-2 py-2 mx-2 bg-white font-mono text-xs border-2 rounded-lg focus:shadow-outline"
              onChange={(e) => setUrl(e.target.value)}
              value={url}
            />
            <button
              className="btn-blue-small"
              onClick={async () => {
                try {
                  const _url = new URL(url);
                  const params = new URLSearchParams(_url.search);
                  const hash = _url.hash.substr(1);

                  const action = JSON.parse(params.get("q") || "{}");
                  const anchor = JSON.parse(window.decodeURIComponent(hash || "{}"));
                  const key = anchor.key || action.payload?.key;

                  const errors = [];
                  if (!action.payload.uri) errors.push("payload.uri");
                  if (!key) errors.push("key");
                  if (errors.length > 0)
                    throw new Error(`Please ensure the following params exists in the URL: ${errors}`);

                  const uriContent = await (await fetch(action.payload.uri)).json();

                  setEncryptedDocument(JSON.stringify({ ...uriContent, key }, undefined, 2));
                  setValid(true);
                  setNoticeMsg("");
                  setRawDocument("");
                } catch (e) {
                  setValid(false);
                  setNoticeMsg(`${e}`);
                }
              }}
            >
              Load
            </button>
          </div>
          <textarea
            className="w-full px-3 py-2 font-mono text-gray-800 border-2 rounded-lg focus:shadow-outline"
            rows={20}
            onChange={(e) => setEncryptedDocument(e.target.value)}
            placeholder={JSON.stringify({ cipherText: "", iv: "", tag: "", type: "" }, undefined, 2)}
            value={encryptedDocument}
          />
        </div>
      </div>
      {isValid === false && <FailedAlert>{noticeMsg}</FailedAlert>}
    </div>
  );
};
