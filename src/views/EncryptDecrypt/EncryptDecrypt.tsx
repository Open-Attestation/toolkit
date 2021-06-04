import { generateEncryptionKey, encryptString, decryptString } from "@govtechsg/oa-encryption";
import React, { useEffect, useState } from "react";
import { FailedAlert } from "./../../components/Alert/Alert";

const SAMPLE_DOC_URL =
  "https://schemata.openattestation.com/sg/gov/moh/pdt-healthcert/1.0/healthcert-endorsed-document.json";

export const EncryptDecrypt: React.FunctionComponent = () => {
  const [key, setKey] = useState(generateEncryptionKey());
  const [rawDocument, setRawDocument] = useState("");
  const [encryptedDocument, setEncryptedDocument] = useState("");
  const [isValid, setValid] = useState(true);
  const [noticeMsg, setNoticeMsg] = useState("");

  useEffect(() => {
    fetch(SAMPLE_DOC_URL)
      .then((res) => res.text())
      .then((text) => setRawDocument(text));
  }, []);

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
                setRawDocument(decryptString(encryptedDoc));
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
          <textarea
            className="w-full h-full px-3 py-2 font-mono text-gray-800 border-2 rounded-lg focus:shadow-outline"
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
