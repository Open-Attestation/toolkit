import React from "react";
import { Router } from "./Router";
import homeLogo from "./undraw_different_love_a3rg.png";

export const App: React.FunctionComponent = () => (
  <div className="flex flex-col min-h-screen">
    <nav className="py-3 text-white bg-indigo-800">
      <div className="container mx-auto px-6 md:px-2">
        <div className="flex flex-row flex-grow flex-shrink justify-between">
          <div className="flex self-center">
            <a href="/">
              Open<span className="font-bold">Attestation</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
    <main className="flex-1 flex flex-col">
      <section>
        <div className="container mx-auto px-6 md:px-2 py-8">
          <div className="flex flex-wrap items-center">
            <div className="w-full sm:w-2/3">
              <div className="py-12 text-center sm:text-left">
                <div className="font-semibold text-6xl header-one">Toolkit</div>
                <div className="font-light text-2xl mt-4 w-full md:w-9/12 lg:w-7/12 header-two">
                  Explore the different tools
                </div>
              </div>
            </div>
            <img className="w-full sm:w-1/3" src={homeLogo} />
          </div>
        </div>
      </section>
      <section className="bg-gray-300 flex-1 py-6">
        <Router />
      </section>
    </main>
    <footer className="py-6 text-white bg-indigo-800">
      <div className="container mx-auto px-6 md:px-2" />
    </footer>
  </div>
);
