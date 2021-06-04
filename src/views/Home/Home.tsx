import React from "react";
import { Link } from "react-router-dom";

interface ToolProps {
  title: string;
  to: string;
}
const Tool: React.FunctionComponent<ToolProps> = ({ title, to }) => (
  <Link
    className="transition duration-200 ease-out border border-t-8 border-indigo-500 text-center text-xl py-6 px-2 uppercase bg-indigo-200 hover:bg-indigo-100"
    to={to}
  >
    {title}
  </Link>
);

export const Home: React.FunctionComponent = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 container mx-auto">
    <Tool title="(un)Wrap" to="/wrap" />
    <Tool title="Verify" to="/verify" />
    <Tool title="Dns" to="/dns" />
    <Tool title="Diagnose" to="/diagnose" />
    <Tool title="Encrypt/Decrypt" to="/encrypt-decrypt" />
  </div>
);
