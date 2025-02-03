import React, { useState, useEffect } from "react";
import booking from "../../assets/Images/booking.png";
import bookingCardIcon from "../../assets/Images/bookingCardIcon.png";
import axios from "axios";

export default function Profile() {
  const URL = import.meta.env.VITE_BASE_URL;
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const getUserOrders = async () => {
      try {
        const email = localStorage.getItem("Email");

        if (!email) {
          console.error("No email found in localStorage");
          return;
        }

        const response = await axios.get(`${URL}/user-orders`, {
          params: { email }, // Correct way to send email in a GET request
        });

        if (response.status === 200) {
          console.log("User orders are", response.data);
          setUserOrders(response.data);
        }
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };

    getUserOrders();
  }, []);

  return (
    <>
      <div className="booking-overlay"></div>
      <img src={booking} alt="banner" className="booking-bg-img" />
      <h1 className="dashboard-text">Welcome to your Dashboard</h1>
      <div className="orders-container">
        {userOrders.map((order) => (
          <div className="booking-card" key={order.id}>
            <div className="booking-card-heading">
              <img
                src={bookingCardIcon}
                alt="booking-icon"
                className="booling-card-icon"
              />
              <label className="category-name">{order.bookingCategory}</label>
            </div>
            <p className="card-contents">
              <label className="card-contents-heading">
                Booked Mobile Number:
              </label>{" "}
              {order.mobileNumber}
            </p>
            <p className="card-contents">
              <label className="card-contents-heading">Order Type:</label>{" "}
              {order.bookingType}
            </p>

            <p className="card-contents">
              <label className="card-contents-heading">Email:</label>{" "}
              {order.email}
            </p>
            <div className="status">Pending</div>
          </div>
        ))}
      </div>
    </>
  );
}
