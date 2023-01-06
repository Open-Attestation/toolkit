import React from "react";
import { ActionCreator } from "./views/action-creator";
import { Diagnose } from "./views/diagnose";
import { Dns } from "./views/dns";
import { EncryptDecrypt } from "./views/encrypt-decrypt";
import { Home } from "./views/home";
import { Verify } from "./views/verify";
import { Wrap } from "./views/wrap";

export const routes = [
  { path: "/", exact: true, element: <Home /> },
  { path: "/wrap", exact: true, element: <Wrap />, title: "(un)Wrap" },
  { path: "/verify", exact: true, element: <Verify />, title: "Verify" },
  { path: "/dns", exact: true, element: <Dns />, title: "Dns" },
  { path: "/diagnose", exact: true, element: <Diagnose />, title: "Diagnose" },
  { path: "/encrypt-decrypt", exact: true, element: <EncryptDecrypt />, title: "Encrypt/Decrypt" },
  { path: "/action-creator", exact: true, element: <ActionCreator />, title: "Action Creator" },
];
