import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Column({ ColumnItems }) {
  const location = useLocation();
  const navigate = useNavigate();

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
  return (
    <div className="column-container">
      {ColumnItems.map((item, index) => (
        <label
          key={index}
          className={index === 0 ? "footer-column-heading" : "footer-item"}
          onClick={() => handleNavigation(item.position)}
        >
          {item.menu}
        </label>
      ))}
    </div>
  );
}
