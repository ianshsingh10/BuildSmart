import React, { useEffect, useState, useRef } from "react";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Cart } from "../utils/constant"; // adjust path if needed

function Navbar({ isLoggedIn, setIsLoggedIn, username }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");

    if (token && savedUsername && role) {
      setIsLoggedIn(true);
    }

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [role, setIsLoggedIn]);

  // Fetch cart item count
  useEffect(() => {
    const fetchCartCount = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) return;

      try {
        const { data } = await axios.get(`${Cart}/user/${userId}`);
        const items = data.items || [];
        setCartCount(items.length); // distinct items count
      } catch (err) {
        console.error("Error fetching cart items:", err);
      }
    };

    if (isLoggedIn) fetchCartCount();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <nav className="sticky z-10 top-0 w-full flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-gray-800">
        BuildSmart
      </Link>
      <div className="flex items-center">
        <Link to="/cart" className="relative mx-6">
          <ShoppingCart className="w-6 h-6 text-gray-700" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        <div className="flex items-center space-x-6">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition"
              >
                {username.toUpperCase()}{" "}
                <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  {role === "seller" && (
                    <Link
                      to="/companydashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Company Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
