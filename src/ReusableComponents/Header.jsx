import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white text-white p-4 flex justify-between">
      <nav className="flex gap-6">
        <Link to="/" className="text-white hover:text-yellow-200">
          Rapid Fire
        </Link>
        <Link to="/pathfinding" className="text-white hover:text-yellow-200">
          Pathfinding
        </Link>
        <Link to="/memory" className="text-white hover:text-yellow-200">
          Memory
        </Link>
      </nav>
    </header>
  );
}