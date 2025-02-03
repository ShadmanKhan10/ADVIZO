import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Sidebar({
  isLoggedIn,
  setIsLoggedIn,
  setShowSidebar,
  handleNavigation,
  setUserInitial,
  setProfileActive,
}) {
  const URL = import.meta.env.VITE_BASE_URL;

  const closeSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log(response.data.message);

      // Reset authentication state
      setIsLoggedIn(false);
      setUserInitial(""); // Clear user initial if used
      setProfileActive(false);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <>
      <div className="sidebar-overlay" onClick={closeSidebar}></div>
      <div className="sidebar-container">
        <div className="sidebar-menu-container">
          <li
            className="sidebar-nav-link"
            onClick={() => handleNavigation("home")}
          >
            Home
          </li>
          <li
            className="sidebar-nav-link"
            onClick={() => handleNavigation("about-us")}
          >
            About Us
          </li>
          <li
            className="sidebar-nav-link"
            onClick={() => handleNavigation("services")}
          >
            Services
          </li>
          <li
            className="sidebar-nav-link"
            onClick={() => handleNavigation("steps")}
          >
            Steps
          </li>
          {!isLoggedIn && (
            <>
              <button className="login-btn-sidebar">
                <li
                  className="sidebar-nav-link sidebar-nav-link-login"
                  onClick={() => handleNavigation("login")}
                >
                  Login
                </li>
              </button>
              <button className="signup-btn-sidebar">
                <li
                  className="sidebar-nav-link sidebar-nav-link-signup"
                  onClick={() => handleNavigation("signup")}
                >
                  Sign Up
                </li>
              </button>
            </>
          )}
          {isLoggedIn && (
            <>
              <button className="login-btn-sidebar">
                <Link
                  className="sidebar-nav-link sidebar-nav-link-login"
                  to="/profile"
                >
                  Profile
                </Link>
              </button>
              <button
                onClick={handleLogout}
                className="signup-btn-sidebar logout-btn-sidebar"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
