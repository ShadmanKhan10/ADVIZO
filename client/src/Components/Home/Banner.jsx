import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import online from "../../assets/Images/online.jpg";
import electronics from "../../assets/Images/electronics.jpg";
import vehical from "../../assets/Images/vehical.jpg";
import furniture from "../../assets/Images/furniture.jpg";

export default function Banner() {
  const images = [online, electronics, vehical, furniture];
  const [currIndex, setCurrIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1); // Always slide forward
      setCurrIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner-container">
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.img
          key={currIndex}
          src={images[currIndex]}
          alt="banner"
          className="banner-img"
          initial={{ x: direction * 100 + "%" }} // Start outside viewport
          animate={{ x: "0%" }} // Move to center
          exit={{ x: -direction * 100 + "%" }} // Move out to the left
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </AnimatePresence>
    </div>
  );
}
