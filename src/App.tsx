import React from "react";
import { Router } from "./Router";

export const App: React.FunctionComponent = () => (
  <div className="flex flex-col min-h-screen">
    <Router />
    <footer className="py-6 text-white bg-indigo-800">
      <div className="container mx-auto px-6 md:px-2">
        <p>Copyright © 2020 Government Technology Agency (Singapore)</p>
      </div>
    </footer>
  </div>
);
