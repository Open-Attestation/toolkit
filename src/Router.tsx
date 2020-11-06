import React, { ReactElement } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Home } from "./views/Home";
import { Unwrap } from "./views/Unwrap/Unwrap";

export const Router = (): ReactElement => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/unwrap">
          <Unwrap />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
