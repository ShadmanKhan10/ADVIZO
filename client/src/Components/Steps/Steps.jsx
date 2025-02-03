import React from "react";
import happyCustomer from "../../assets/Images/happyCustomer.jpg";
import WorkingPoint from "./WorkingPoint";
import { Points } from "../DATA/Data";

export default function Steps() {
  const scrollableSections = ["home", "about-us", "steps", "service-card"];

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

    // setShowSidebar(false);
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
        top: sectionPosition - navbarHeight - 10,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="how-it-works-container">
      <h1 className="how-it-works-text">Your Path to Smart Shopping</h1>
      <div className="working-point-and-image-container">
        <div className="working-points-container">
          <WorkingPoint
            heading={Points.headingOne}
            pointDescription={Points.pointOne}
          />
          <WorkingPoint
            heading={Points.headingTwo}
            pointDescription={Points.pointTwo}
          />
          <WorkingPoint
            heading={Points.headingThree}
            pointDescription={Points.pointThree}
          />
        </div>
        <img
          src={happyCustomer}
          alt="happyShopping"
          className="working-points-image"
        />
      </div>
      <button
        onClick={() => handleNavigation("service-card")}
        className="try-btn"
      >
        TRY NOW
      </button>
    </div>
  );
}
