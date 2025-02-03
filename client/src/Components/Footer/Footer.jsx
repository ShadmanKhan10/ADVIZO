import React, { useState } from "react";
import Column from "./Column";
import insta from "../../assets/Images/instagram.png";
import fb from "../../assets/Images/facebook.png";
import gmail from "../../assets/Images/email.png";
import linkedln from "../../assets/Images/linkedin.png";
import x from "../../assets/Images/x.png";
import { ColumnItems1, ColumnItems2 } from "../DATA/Data";

export default function Footer() {
  const [email, setEmail] = useState("");

  const images = [insta, fb, gmail, linkedln, x];

  const handleInputChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <>
      <div className="footer-container">
        <Column ColumnItems={ColumnItems1} />
        <Column ColumnItems={ColumnItems2} />
        <div className="search-social-media-column">
          <p className="news-letter-text">Join our Newsletter</p>
          <div className="news-letter-container">
            <input
              type="search"
              placeholder="Enter your email"
              onChange={handleInputChange}
              value={email}
              className="search-input"
            />
            <button className="join-news-letter-btn">Join</button>
          </div>
          <div className="social-media-container">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="social-icon"
                className="social-icon-footer"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
