import React from "react";
import servicesBanner from "../../assets/Images/servicesBanner.png";

export default function ServicesBanner() {
  return (
    <div className="services-banner-container">
      <div className="banner-text-container">
        <h1 className="banner-text">
          Get Personalized Assistance, Anytime, Anywhere
        </h1>
        <p className="banner-tagline">Expert guidance tailored to your needs</p>
      </div>
      <img src={servicesBanner} alt="banner" className="services-banner" />
    </div>
  );
}
