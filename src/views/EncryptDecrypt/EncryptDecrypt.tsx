import { generateEncryptionKey, encryptString, decryptString } from "@govtechsg/oa-encryption";
import React, { useState } from "react";
import { FailedAlert } from "./../../components/Alert/Alert";

const SAMPLE_ENCRYPTED_DOC =
  "https://action.openattestation.com/?q=%7B%22type%22%3A%22DOCUMENT%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Fapi-vaccine.storage.staging.notarise.io%2Fdocument%2F6cfbbcbf-85a1-4644-b61a-952c12376502%22%2C%22key%22%3A%222b1236683c3a842ed4a0bb032c1cf668e24bcaf8ce599aeef502c93cb628152c%22%2C%22permittedActions%22%3A%5B%22VIEW%22%2C%22STORE%22%5D%2C%22redirect%22%3A%22https%3A%2F%2Fwww.verify.gov.sg%2Fverify%22%7D%7D";

export const EncryptDecrypt: React.FunctionComponent = () => {
  const [key, setKey] = useState(generateEncryptionKey());
  const [rawDocument, setRawDocument] = useState("");
  const [url, setUrl] = useState(SAMPLE_ENCRYPTED_DOC);
  const [encryptedDocument, setEncryptedDocument] = useState("");
  const [isValid, setValid] = useState(true);
  const [noticeMsg, setNoticeMsg] = useState("");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl mb-4">Encrypt/Decrypt an OpenAttestation document</h1>
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
            <button
              className="px-2 py-2 bg-blue-500 text-xs text-white border border-transparent rounded"
              onClick={() => setKey(generateEncryptionKey())}
            >
              Regenerate
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-center mx-4">
          <button
            className="btn-primary"
            onClick={() => {
              setEncryptedDocument(JSON.stringify(encryptString(rawDocument, key), undefined, 2));
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
              className="px-2 py-2 bg-blue-500 text-xs text-white border border-transparent rounded"
              onClick={async () => {
                try {
                  const params = new URLSearchParams(new URL(url).search);
                  const q = params.get("q");
                  if (!q) {
                    throw new Error(`Missing "q" query param in URL`);
                  }
                  const { payload } = JSON.parse(q);
                  const missingKeys = ["uri", "key"].filter((key) => !(key in payload));
                  if (missingKeys.length !== 0) {
                    throw new Error(`Missing ${missingKeys.toString()} in URL`);
                  }
                  const uriContent = await (await fetch(payload.uri)).json();
                  setEncryptedDocument(JSON.stringify({ ...uriContent, key: payload.key }, undefined, 2));
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
            placeholder={JSON.stringify({ cipherText: "", iv: "", tag: "", key: "", type: "" }, undefined, 2)}
            value={encryptedDocument}
          />
        </div>
      </div>
      {isValid === false && <FailedAlert>{noticeMsg}</FailedAlert>}
    </div>
  );
};
