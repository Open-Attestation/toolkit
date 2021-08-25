import { render, screen } from "@testing-library/react";
import React from "react";
import { Breadcrumbs } from "../breadcrumb";

describe("breadcrumbs", () => {
  it("should render 0 breadcrumbs", () => {
    render(<Breadcrumbs breadcrumbs={[]} />);
    expect(screen.queryByTestId("breadcrumbs-list")).not.toBeInTheDocument();
  });

  it("should render 1 breadcrumb", () => {
    render(<Breadcrumbs breadcrumbs={["abc"]} />);
    expect(screen.getByText("abc")).toBeDefined();
    expect(screen.getAllByTestId("breadcrumbs-item")).toHaveLength(1);
  });

  it("should render 2 breadcrumbs", () => {
    render(<Breadcrumbs breadcrumbs={["abc", "xyz"]} />);
    expect(screen.getByText("abc")).toBeDefined();
    expect(screen.getByText("xyz")).toBeDefined();
    expect(screen.getAllByTestId("breadcrumbs-item")).toHaveLength(2);
  });
});
