import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export const Breadcrumb: React.FunctionComponent = () => {
  const location = useLocation();
  const paths = location.pathname.split("/");
  const breadcrumbs = paths.filter((path) => {
    return path !== "";
  });

  return (
    <nav className="container mx-auto m-6">
      <div className="list-reset flex">
        <Link className="font-bold hover:underline" to="/">
          Tools
        </Link>
        {breadcrumbs.map((item, index) => (
          <span key={index}>
            <span className="mx-2">/</span>
            <span className="capitalize">{item}</span>
          </span>
        ))}
      </div>
    </nav>
  );
};
