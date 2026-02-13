import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-sky-500 text-white p-4 flex justify-between">
      
      <nav className="flex gap-6">
        <Link to="/">Rapid Fire</Link>
        <Link to="/pathfinding">Pathfinding</Link>
        <Link to="/memory">Memory</Link>
      </nav>
    </header>
  );
}