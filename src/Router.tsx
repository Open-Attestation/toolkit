import React, { ReactElement } from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Breadcrumb } from "./components/Breadcrumb/Breadcrumb";
import oaLogo from "./images/oa.svg";
import { Dns } from "./views/Dns/Dns";
import { Home } from "./views/Home";
import { Verify } from "./views/Verify/Verify";
import { Wrap } from "./views/Wrap/Wrap";

export const Router = (): ReactElement => {
  return (
    <BrowserRouter>
      <nav className="py-3 text-white bg-navy">
        <div className="container mx-auto">
          <div className="flex flex-row flex-grow flex-shrink justify-between">
            <div className="flex items-center">
              <img className="w-8 mr-4" src={oaLogo} alt="OpenAttestation Logo" />
              <Link to="/">
                Open<span className="font-bold">Attestation</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 flex flex-col">
        <section>
          <div className="container mx-auto py-4 lg:py-8">
            <div className="flex flex-wrap items-center">
              <div className="w-full sm:w-2/3">
                <div className="py-12 text-center sm:text-left">
                  <div className="font-semibold text-6xl header-one">Toolkit</div>
                  <div className="font-light text-2xl mt-4 w-full md:w-9/12 lg:w-7/12 header-two">
                    Explore the different tools made with OpenAttestation.
                  </div>
                </div>
              </div>
              <div className="w-full sm:w-1/3">
                <img
                  className="mx-auto mb-8 lg:mb-0"
                  style={{ maxWidth: "240px" }}
                  src="/images/home-tools.png"
                  alt="decorative header"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="bg-gray-200 flex-1 py-4">
          <Breadcrumb />
          <Switch>
            <Route exact path="/wrap">
              <Wrap />
            </Route>
            <Route exact path="/verify">
              <Verify />
            </Route>
            <Route exact path="/dns">
              <Dns />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </section>
      </main>
      <footer className="py-6 text-white bg-navy">
        <div className="container mx-auto">
          <p>Copyright © 2020 Government Technology Agency (Singapore)</p>
        </div>
      </footer>
    </BrowserRouter>
  );
};
