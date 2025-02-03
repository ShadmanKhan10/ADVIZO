import React, { useEffect, useState } from "react";
import hamburger from "../../assets/Images/hamburger.png";
import close from "../../assets/Images/close.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";

export default function Navbar({
  isLoggedIn,
  setIsLoggedIn,
  setUserInitial,
  userInitial,
}) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [profileActive, setProfileActive] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_BASE_URL;

  const scrollableSections = ["home", "about-us", "steps"];

  const handleNavigation = (target) => {
    if (scrollableSections.includes(target)) {
      if (location.pathname !== "/") {
        navigate("/", { replace: true });
        setTimeout(() => scrollToSection(target), 300); // Delay ensures home is loaded first
      } else {
        scrollToSection(target);
      }
    } else {
      navigate(`/${target}`);
    }

    setShowSidebar(false);
  };

  // Helper function to scroll to a section
  const scrollToSection = (target) => {
    const section = document.getElementById(target);
    const navbar = document.querySelector("nav");

    if (section && navbar) {
      const navbarHeight = navbar.offsetHeight;
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: sectionPosition - navbarHeight,
        behavior: "smooth",
      });
    }
  };

  const handleSidebarView = () => {
    setShowSidebar((prev) => !prev);
  };

  const handleUserProfileDropdown = () => {
    setProfileActive((prev) => !prev);
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
      {profileActive && isLoggedIn && (
        <div className="user-profile-dropdown">
          <img
            onClick={handleUserProfileDropdown}
            src={close}
            className="dropdown-close"
            alt="close"
          />
          <Link className="link-user-profile-dropdown" to="profile">
            Profile
          </Link>
          <label onClick={handleLogout} className="link-user-profile-dropdown">
            Logout
          </label>
        </div>
      )}
      <nav className="navbar-container">
        <div className="nav-logo-contianer">
          <h1
            onClick={() => handleNavigation("home")}
            className="textual-logo-navbar"
          >
            ADVIZO
          </h1>
        </div>
        <div className="nav-menu-container">
          <li className="nav-link" onClick={() => handleNavigation("home")}>
            Home
          </li>
          <li className="nav-link" onClick={() => handleNavigation("about-us")}>
            About Us
          </li>
          <li className="nav-link" onClick={() => handleNavigation("services")}>
            Services
          </li>
          <li className="nav-link" onClick={() => handleNavigation("steps")}>
            Steps
          </li>
          {!isLoggedIn && (
            <>
              <li
                className="nav-link nav-link-login"
                onClick={() => handleNavigation("login")}
              >
                Login
              </li>
              <li
                className="nav-link nav-link-signup"
                onClick={() => handleNavigation("signup")}
              >
                Sign Up
              </li>
            </>
          )}
          {isLoggedIn && (
            <>
              {/* <Link className="link-login" to="/signup"> */}
              <div
                onClick={handleUserProfileDropdown}
                className="login-indicator-circle"
              >
                <p className="username-initial">{userInitial}</p>
              </div>
              {/* </Link> */}
            </>
          )}
        </div>
        <img
          src={hamburger}
          alt="hamburger"
          className="hanburger-nav-icon"
          onClick={handleSidebarView}
        />
      </nav>
      {showSidebar && (
        <Sidebar
          setIsLoggedIn={setIsLoggedIn}
          isLoggedIn={isLoggedIn}
          setShowSidebar={setShowSidebar}
          handleNavigation={handleNavigation}
          setUserInitial={setUserInitial}
          setProfileActive={setProfileActive}
        />
      )}
    </>
  );
}
