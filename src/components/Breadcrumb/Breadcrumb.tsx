import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

interface BreadcrumbsProps {
  breadcrumbs: string[];
}

export const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({ breadcrumbs }) => {
  if (breadcrumbs.length === 0) return null;
  return (
    <ul data-testid="breadcrumbs-list">
      {breadcrumbs.map((item, index) => (
        <li key={index} data-testid="breadcrumbs-item">
          <span className="mx-2">/</span>
          <span className="capitalize">{item}</span>
        </li>
      ))}
    </ul>
  );
};

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
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
    </nav>
  );
};
