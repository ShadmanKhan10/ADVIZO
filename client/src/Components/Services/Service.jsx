import React from "react";
import vehicalIcon from "../../assets/Images/car.png";
import furnitureIcon from "../../assets/Images/furniture.png";
import homeAppliencesIcon from "../../assets/Images/washingMachine.png";
import devices from "../../assets/Images/devices.png";
import outfits from "../../assets/Images/outfits.png";
import shopping from "../../assets/Images/shopping.png";
import ServicesList from "../Home/ServicesList";
import Footer from "../Footer/Footer";
import ServicesBanner from "./ServicesBanner";
import HowWeHelp from "./HowWeHelp";
import { inPersonGuidence, onCallAssistance } from "../DATA/Data";

export default function Service() {
  return (
    <>
      <ServicesBanner />
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
      <h1 className="how-we-help-text">How we Help</h1>
      <div className="how-we-help-card-container">
        <HowWeHelp
          cardHeading="On Call Assistance"
          cardPoints={onCallAssistance}
        />
        <HowWeHelp
          cardHeading="In Person Guidence"
          cardPoints={inPersonGuidence}
        />
      </div>
      <Footer />
    </>
  );
}
