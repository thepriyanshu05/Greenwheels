"use client";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Detect scroll to add background / shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect login role (user / driver)
  useEffect(() => {
    const driver = JSON.parse(localStorage.getItem("driver"));
    const user = JSON.parse(localStorage.getItem("user"));
    if (driver) {
      setIsLoggedIn(true);
      setUserRole("driver");
    } else if (user) {
      setIsLoggedIn(true);
      setUserRole("user");
    } else {
      setIsLoggedIn(false);
      setUserRole(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Rides", path: "/rides" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between h-16">
        {/* === LOGO SECTION === */}
        <Link
          to="/"
          className="flex items-center space-x-2 group transition-all duration-300"
        >
          {/* 🚗 Realistic Animated Car Logo */}
          <motion.div
            className="w-8 h-8 flex items-center justify-center"
            whileHover={{
              x: [0, 6, 0],
              transition: { duration: 1, ease: "easeInOut", repeat: Infinity },
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 32"
              className="w-8 h-8 text-emerald-600 drop-shadow-md"
              fill="currentColor"
            >
              <path d="M59 14c-.6-2.1-2.2-4.6-4-6l-3.5-3.1C50.2 3.4 48.1 3 46 3H18c-2.1 0-4.2.4-5.5 1.9L9 8C7.2 9.4 5.6 11.9 5 14l-1 3c-.7 2.1.9 5 3 5v5c0 1.7 1.3 3 3 3h4c1.7 0 3-1.3 3-3v-1h28v1c0 1.7 1.3 3 3 3h4c1.7 0 3-1.3 3-3v-5c2.1 0 3.7-2.9 3-5l-1-3zM19 7h26c1.5 0 3.5.3 4.6 1.3L52 10H12l2.4-1.7C15.5 7.3 17.5 7 19 7zm-5 17a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm36 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            </svg>
          </motion.div>

          <span className="ml-1 text-xl font-bold text-emerald-700 group-hover:text-emerald-600 transition-colors duration-200">
            Greenwheels
          </span>
        </Link>

        {/* === DESKTOP NAVIGATION === */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-emerald-600"
                  : "text-gray-700 hover:text-emerald-600"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Auth Section */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              <Link
                to={
                  userRole === "driver"
                    ? "/rider-dashboard"
                    : "/user-dashboard"
                }
              >
                <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-md shadow hover:shadow-lg hover:scale-105 transition-transform">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-emerald-600">
                  Sign In
                </Button>
              </Link>
              <Link to="/role-selection">
                <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-md shadow hover:shadow-lg hover:scale-105 transition-transform">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* === MOBILE MENU TOGGLE === */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-emerald-600"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* === MOBILE MENU DRAWER === */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg"
          >
            <div className="flex flex-col items-center py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium ${
                    location.pathname === link.path
                      ? "text-emerald-600"
                      : "text-gray-700 hover:text-emerald-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isLoggedIn ? (
                <>
                  <Link
                    to={
                      userRole === "driver"
                        ? "/rider-dashboard"
                        : "/user-dashboard"
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-2 rounded-md shadow hover:shadow-lg hover:scale-105 transition-transform">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-gray-700 hover:text-red-600"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="text-gray-700 hover:text-emerald-600">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/role-selection" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-2 rounded-md shadow hover:shadow-lg hover:scale-105 transition-transform">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
