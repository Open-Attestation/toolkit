import { Buffer } from "buffer";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./app";

window.Buffer = window.Buffer || Buffer;

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
