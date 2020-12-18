import React, { ReactElement } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Home } from "./views/Home";
import { Verify } from "./views/Verify/Verify";
import { Wrap } from "./views/Wrap/Wrap";

export const Router = (): ReactElement => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/wrap">
          <Wrap />
        </Route>
        <Route exact path="/verify">
          <Verify />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
