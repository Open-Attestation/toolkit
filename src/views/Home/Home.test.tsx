import { render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Home } from "./Home";

describe("home", () => {
  it("render learn react link", () => {
    expect.assertions(1);
    render(<Home />, { wrapper: MemoryRouter });
    expect(screen.getByTestId("learn-react-link")).toHaveTextContent("Learn React");
  });

  it("render learn help", () => {
    expect.assertions(1);
    render(<Home />, { wrapper: MemoryRouter });
    expect(screen.getByTestId("help-link")).toHaveTextContent("Help");
  });
});
