import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { googleLogout } from "@react-oauth/google";

export default function Header() {
  const navigate = useNavigate();
  const cookies = new Cookies();


  const handleLogout = () => {
    // Google logout (safe even if not used)
    try {
      googleLogout();
    } catch (e) {}

    // remove JWT cookie
    cookies.remove("jwt_authentication", { path: "/" });

    // remove refresh token
    localStorage.removeItem("refresh");

    // redirect
    navigate("/");
  };

  return (
    <header className="bg-white p-4 flex justify-between items-center">
      <nav className="flex gap-6">
        <Link to="/" className="text-black hover:text-yellow-500">
          Rapid Fire
        </Link>
        <Link to="/pathfinding" className="text-black hover:text-yellow-500">
          Pathfinding
        </Link>
        <Link to="/memory" className="text-black hover:text-yellow-500">
          Memory
        </Link>
        <Link to="/Video" className="text-black hover:text-yellow-500">
          Video
        </Link>
      </nav>

      
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </header>
  );
}