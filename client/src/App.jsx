import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Signup from "./Components/Auth/Signup";
import Login from "./Components/Auth/Login";
import furniture from "./assets/Images/furniture.png";
import vehical from "./assets/Images/car.png";
import devices from "./assets/Images/devices.png";
import outfits from "./assets/Images/outfits.png";
import shopping from "./assets/Images/shopping.png";
import electronics from "./assets/Images/washingMachine.png";
import axios from "axios";
import PerticularService from "./Components/Services/PerticularService";
import furnitureOverlay from "./assets/Images/furnitureOverlay.jpg";
import electronicOverlay from "./assets/Images/electronicOverlay.jpg";
import outfitOverlay from "./assets/Images/outfitOverlay.jpg";
import carOverlay from "./assets/Images/carOverlay.jpg";
import laptopOverlay from "./assets/Images/laptopOverlay.jpg";
import onlineOverlay from "./assets/Images/onlineOverlay.jpg";
import Service from "./Components/Services/Service";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Payment from "./Components/Profile/Profile";
import Profile from "./Components/Profile/Profile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState(null);
  const URL = import.meta.env.VITE_BASE_URL;
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${URL}/auth/me`, {
          withCredentials: true, // IMPORTANT: Ensures cookies are sent
        });

        if (response.status === 200) {
          console.log(response.data.name[0]);
          setIsLoggedIn(true);
          setUserInitial(response.data.name[0].toUpperCase());
        }
      } catch (error) {
        console.log(error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [isLoggedIn]);

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <BrowserRouter>
          <Navbar
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            setUserInitial={setUserInitial}
            userInitial={userInitial}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/signup"
              element={<Signup setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/services" element={<Service />} />
            <Route
              path="/services/furniture"
              element={
                <PerticularService
                  serviceIcon={furniture}
                  serviceName="Furniture"
                  overlayImage={furnitureOverlay}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/services/electronics"
              element={
                <PerticularService
                  serviceIcon={electronics}
                  serviceName="Electronics"
                  overlayImage={electronicOverlay}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/services/vehicals"
              element={
                <PerticularService
                  serviceIcon={vehical}
                  serviceName="Vehicals"
                  overlayImage={carOverlay}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/services/devices"
              element={
                <PerticularService
                  serviceIcon={devices}
                  serviceName="Laptops & Mobiles"
                  overlayImage={laptopOverlay}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/services/outfits"
              element={
                <PerticularService
                  serviceIcon={outfits}
                  serviceName="Outfits"
                  overlayImage={outfitOverlay}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route
              path="/services/online-shopping"
              element={
                <PerticularService
                  serviceIcon={shopping}
                  serviceName="Online Shopping"
                  overlayImage={onlineOverlay}
                  isLoggedIn={isLoggedIn}
                />
              }
            />
            <Route path="/profile" element={isLoggedIn && <Profile />} />
          </Routes>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
