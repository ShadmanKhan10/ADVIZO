import React from "react";
import Banner from "./Banner";
import vehicalIcon from "../../assets/Images/car.png";
import furnitureIcon from "../../assets/Images/furniture.png";
import homeAppliencesIcon from "../../assets/Images/washingMachine.png";
import devices from "../../assets/Images/devices.png";
import outfits from "../../assets/Images/outfits.png";
import shopping from "../../assets/Images/shopping.png";
import ServicesList from "./ServicesList";
import AboutUs from "../AboutUs/AboutUs";
import Footer from "../Footer/Footer";
import Steps from "../Steps/Steps";

export default function Home() {
  return (
    <>
      <div id="home">
        <Banner />
        <div id="service-card" className="services-container">
          <ServicesList
            serviceName="Furniture"
            locationPath="furniture"
            serviceImage={furnitureIcon}
          />
          <ServicesList
            serviceName="Electronics"
            serviceImage={homeAppliencesIcon}
            locationPath="electronics"
          />
          <ServicesList
            serviceName="Vehical"
            serviceImage={vehicalIcon}
            locationPath="vehicals"
          />
          <ServicesList
            serviceName="Laptop & Smartphones"
            serviceImage={devices}
            locationPath="devices"
          />
          <ServicesList
            serviceName="Outfits"
            serviceImage={outfits}
            locationPath="outfits"
          />
          <ServicesList
            serviceName="Online Shopping"
            serviceImage={shopping}
            locationPath="online-shopping"
          />
        </div>
        <div id="steps">
          <Steps />
        </div>
        <div id="about-us">
          <AboutUs />
        </div>
        <Footer />
      </div>
    </>
  );
}
