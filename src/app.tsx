import React from "react";
import { Router } from "./router";
import { useGoogleAnalytics } from "./utils/google-analytics";

export const App: React.FunctionComponent = () => {
  useGoogleAnalytics();
  return (
    <div className="flex flex-col min-h-screen">
      <Router />
    </div>
  );
};
