import React from "react";
import check from "../../assets/Images/check.png";

export default function WorkingPoint({ heading, pointDescription }) {
  return (
    <div className="point">
      <img src={check} alt="check" className="check-icon" />
      <strong className="point-heading">{heading}</strong>
      <p className="point-description">{pointDescription}</p>
    </div>
  );
}
