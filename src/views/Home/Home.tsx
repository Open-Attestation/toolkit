import React from "react";
import { Link } from "react-router-dom";

interface ToolProps {
  title: string;
  to: string;
}
const Tool: React.FunctionComponent<ToolProps> = ({ title, to }) => (
  <Link
    className="border border-t-8 border-indigo-500 text-center text-xl py-6 px-2 bg-gradient-to-r from-indigo-100 to-indigo-200 hover:from-indigo-200 hover:to-indigo-300 uppercase"
    to={to}
  >
    {title}
  </Link>
);

export const Home: React.FunctionComponent = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 container mx-auto">
    <Tool title="(un)Wrap" to="/wrap" />
    <Tool title="Verify" to="/verify" />
  </div>
);
