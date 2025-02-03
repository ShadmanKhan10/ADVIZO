import React from "react";

export default function HowWeHelp({ cardHeading, cardPoints }) {
  return (
    <>
      <div className="how-we-help-card">
        <h1 className="card-heading">
          {cardPoints[0] === "Instant expert guidance" ? "📞" : "🤝"}{" "}
          {cardHeading}
        </h1>
        {cardPoints.map((point) => (
          <p key={point} className="card-points">
            ✔️ {point}
          </p>
        ))}
      </div>
    </>
  );
}
