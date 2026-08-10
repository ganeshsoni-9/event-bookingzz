import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaTicketAlt,
  FaBars,
  FaTimes,
  FaUserShield,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
<Link
  to="/"
  onClick={() => setOpen(false)}
  className="flex items-center gap-3 text-white text-xl sm:text-2xl font-bold"
>
  <img
    src="https://imgs.search.brave.com/Cs91ABjQMmI5oB8HEAN78B8LDH-Om16hzKCMLFNT0Y0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YWRkcmVzc2VkdS5j/b20vYXNzZXRzL3Vz/ZXJfbG9nby9kYmZl/NGNlNWI2NDc2MWMw/MjIxN2Y2YTI5MTJl/Yjk1NC5qcGVn"
    alt="Sobhasaria Logo"
className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full bg-white p-1 shadow-lg border-2 border-white/30"
  />

  <span>Sobhasaria EventAdda</span>
</Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-200 hover:text-white transition"
            >
              Events
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className="text-gray-200 hover:text-white transition"
              >
                Dashboard
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition"
              >
                <FaUserShield />
                Admin Dashboard
              </Link>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-200 hover:text-white transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white text-2xl"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="flex flex-col gap-4 p-4">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="text-white"
            >
              Events
            </Link>

            {user && (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="text-white"
              >
                Dashboard
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="text-yellow-400 flex items-center gap-2"
              >
                <FaUserShield />
                Admin Dashboard
              </Link>
            )}

            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="text-white"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-left text-red-400"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
