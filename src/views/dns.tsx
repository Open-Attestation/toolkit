import {
  getDocumentStoreRecords,
  getDnsDidRecords,
  OpenAttestationDNSTextRecord,
  OpenAttestationDnsDidRecord,
} from "@govtechsg/dnsprove";
import React, { useEffect, useState } from "react";
import { FailedAlert, SucceedAlert } from "../components/alert";

enum Status {
  INITIAL = "INITIAL",
  SUCCEED = "SUCCEED",
  FAILED = "FAILED",
}

export const Dns: React.FunctionComponent = () => {
  const [location, setLocation] = useState("demo-tradetrust.openattestation.com");
  const [status, setStatus] = useState<Status>(Status.INITIAL);
  const [recordsDid, setRecordsDid] = useState<OpenAttestationDnsDidRecord[]>([]);
  const [recordsText, setRecordsTxt] = useState<OpenAttestationDNSTextRecord[]>([]);

  useEffect(() => {
    setStatus(Status.INITIAL);
  }, [location]);

  const getRecords = async (): Promise<void> => {
    try {
      const dnsDidRecords = await getDnsDidRecords(location);
      const dnsTextRecords = await getDocumentStoreRecords(location);
      setRecordsDid(dnsDidRecords);
      setRecordsTxt(dnsTextRecords);
      console.log(dnsDidRecords, dnsTextRecords);
      setStatus(Status.SUCCEED);
    } catch (e) {
      setStatus(Status.FAILED);
      console.error(e);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl mb-4">Get OpenAttestation DNS TXT records</h1>
      <input
        className="w-full px-3 py-2 text-gray-800 border-2 rounded-lg focus:shadow-outline mb-2"
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter your domain"
        value={location}
      />
      <button
        className="btn-primary"
        onClick={() => {
          getRecords();
        }}
      >
        Get Records
      </button>
      {status === Status.SUCCEED && (
        <>
          {recordsDid.length === 0 && recordsText.length === 0 && location.length !== 0 ? (
            <FailedAlert>
              Did you enter the right DNS? Is there OpenAttestation TXT records created on{" "}
              <span className="text-red-400">{location}</span>?
            </FailedAlert>
          ) : (
            <SucceedAlert>Total {[...recordsDid, ...recordsText].length} record(s) found.</SucceedAlert>
          )}
          {recordsDid && (
            <div className="my-8">
              <h3 className="font-bold">DNS DID records</h3>
              <p>{recordsDid.length} record(s) found.</p>
              <pre className="mt-2 text-left bg-white border-2 border-teal-600 whitespace-pre-wrap">
                {JSON.stringify(recordsDid, null, 2)}
              </pre>
            </div>
          )}
          {recordsText && (
            <div className="my-8">
              <h3 className="font-bold">DNS TXT records</h3>
              <p>{recordsText.length} record(s) found.</p>
              <pre className="mt-2 text-left bg-white border-2 border-teal-600 whitespace-pre-wrap">
                {JSON.stringify(recordsText, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}
      {status === Status.FAILED && <FailedAlert>Get records failed</FailedAlert>}
    </div>
  );
};
