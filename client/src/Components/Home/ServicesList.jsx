import React from "react";
import { useNavigate } from "react-router-dom";

export default function ServicesList({
  serviceName,
  serviceImage,
  locationPath,
}) {
  const navigate = useNavigate();

  const handleCategoryShopping = () => {
    navigate(`/services/${locationPath}`);
  };

  return (
    <div className="service-card" onClick={handleCategoryShopping}>
      <img src={serviceImage} className="service-img" alt="service" />
      <p className="service-name">{serviceName}</p>
    </div>
  );
}
