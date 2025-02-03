import React from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import furniture from "../../assets/Images/furniture.jpg";

export default function AboutUs() {
  const navigate = useNavigate();

  const navigateToServices = () => {
    navigate("/services");
  };

  return (
    <>
      <div className="about-us-container">
        <img className="about-us-img" alt="about-us-img" src={furniture} />
        <div className="about-us-text">
          {isMobile ? (
            <h1 className="about-us-heading-text">
              Making Smart Shopping Simple & Stress-Free
            </h1>
          ) : (
            <>
              {" "}
              <h1 className="about-us-heading-text">Making Smart Shopping </h1>
              <h1 className="about-us-heading-text">Simple & Stress-Free</h1>
            </>
          )}

          <p className="about-us-description">
            At Advizo, we believe that making the right purchase shouldn't be
            overwhelming. Whether you're buying electronics, vehicles,
            furniture, or anything else—new or second-hand—we connect you with
            experienced professionals who provide expert advice tailored to your
            needs and budget.
          </p>
        </div>
      </div>
      <div className="btn-container">
        <button
          onClick={navigateToServices}
          className="try-btn explore-services-btn"
        >
          EXPLORE SERVICES
        </button>
      </div>
    </>
  );
}
