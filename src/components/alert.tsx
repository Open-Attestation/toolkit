import React, { PropsWithChildren } from "react";

export const FailedAlert: React.FunctionComponent<PropsWithChildren> = ({ children }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">{children}</strong>
  </div>
);

export const SucceedAlert: React.FunctionComponent<PropsWithChildren> = ({ children }) => (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">{children}</strong>
  </div>
);
