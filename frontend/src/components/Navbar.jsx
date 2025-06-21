import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [user, setUser] = useState(null); // Simulated user state

  const accountDropdownRef = useRef(null);
  const serviceDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target)
      ) {
        setIsServicesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = () => {
    setUser({
      displayName: "John Doe",
      email: "john@example.com",
      photoURL: "https://i.pravatar.cc/150?img=3",
    });
  };

  const handleLogout = () => {
    setUser(null);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Coeus Logo"
          />
          <span className="text-2xl font-semibold dark:text-white">
            Coeus.ai
          </span>
        </Link>

        {/* Right side user and hamburger */}
        <div
          className="flex items-center md:order-2 space-x-3 relative"
          ref={accountDropdownRef}
        >
          {user ? (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src={user.photoURL}
                  alt="user avatar"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-12 right-0 z-50 my-4 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div>{user.displayName}</div>
                    <div className="font-medium truncate text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              Sign in (Demo)
            </button>
          )}

          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:text-gray-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 17 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <div
          className={`${
            isMobileMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full md:flex md:w-auto md:order-1`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-8 font-medium mt-4 md:mt-0 p-4 md:p-0 bg-gray-50 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent rounded-lg border md:border-none border-gray-100">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white"
              >
                Home
              </Link>
            </li>

            <li className="relative" ref={serviceDropdownRef}>
              <button
                onClick={() =>
                  setIsServicesDropdownOpen(!isServicesDropdownOpen)
                }
                className="flex items-center py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white"
              >
                Services
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isServicesDropdownOpen && (
                <ul className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg z-20">
                  <li>
                    <Link
                      to="/services/resume-scanner"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Resume Scanner
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/interview-scheduler"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Interview Scheduler
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/services/policy-bot"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Policy Bot
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/pricing"
                className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white"
              >
                Pricing
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="block py-2 px-3 text-gray-900 hover:text-blue-700 dark:text-white"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
