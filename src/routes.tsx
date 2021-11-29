import React from "react";
import { Route, Switch } from "react-router-dom";
import { ActionCreator } from "./views/action-creator";
import { Diagnose } from "./views/diagnose";
import { Dns } from "./views/dns";
import { EncryptDecrypt } from "./views/encrypt-decrypt";
import { Home } from "./views/home";
import { Verify } from "./views/verify";
import { Wrap } from "./views/wrap";

export interface RouteProps {
  path: string;
  exact?: boolean;
  component?: React.FunctionComponent;
}

interface RoutesProps {
  routes: RouteProps[];
}

export const routes = [
  { path: "/", exact: true, component: Home },
  { path: "/wrap", exact: true, component: Wrap, title: "(un)Wrap" },
  { path: "/verify", exact: true, component: Verify, title: "Verify" },
  { path: "/dns", exact: true, component: Dns, title: "Dns" },
  { path: "/diagnose", exact: true, component: Diagnose, title: "Diagnose" },
  { path: "/encrypt-decrypt", exact: true, component: EncryptDecrypt, title: "Encrypt/Decrypt" },
  { path: "/action-creator", exact: true, component: ActionCreator, title: "Action Creator" },
];

export const Routes = ({ routes }: RoutesProps): React.ReactElement => {
  return (
    <Switch>
      {routes.map((route) => (
        <Route key={route.path} {...route} />
      ))}
    </Switch>
  );
};
