import React from "react";
import { Router } from "./router";

export const App: React.FunctionComponent = () => (
  <div className="flex flex-col min-h-screen">
    <Router />
  </div>
);
