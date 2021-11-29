import React from "react";
import { Link } from "react-router-dom";
import { routes, RouteProps } from "./../routes";

interface ToolsProps extends RouteProps {
  title: string;
}

export const Home: React.FunctionComponent = () => {
  const tools = routes.filter((route) => route.path !== "/") as ToolsProps[];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 container mx-auto">
      {tools.map((tool) => (
        <Link
          key={tool.path}
          className="transition duration-200 ease-out border border-t-8 border-indigo-500 text-center text-xl py-6 px-2 uppercase bg-indigo-200 hover:bg-indigo-100"
          to={tool.path}
        >
          {tool.title}
        </Link>
      ))}
    </div>
  );
};
