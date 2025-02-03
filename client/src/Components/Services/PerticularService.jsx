import React, { useState } from "react";
import axios from "axios";
import mobile from "../../assets/Images/mobile.png";
import call from "../../assets/Images/call.png";
import inPerson from "../../assets/Images/inPerson.png";
import decision from "../../assets/Images/decision.png";

export default function PerticularService({
  serviceIcon,
  serviceName,
  overlayImage,
  isLoggedIn,
}) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isMobileNumberValid, setIsMobileNumberValid] = useState(true);
  const [bookingError, setBookingError] = useState(false);
  const [success, setSuccess] = useState(false);
  const URL = import.meta.env.VITE_BASE_URL;

  const handleMobileNumberChange = (event) => {
    const value = event.target.value;

    if (/^\d{0,10}$/.test(value)) {
      setMobileNumber(value);

      setIsMobileNumberValid(value.length === 0 || value.length === 10);
    }
  };
  const RAZORPAY_TEST_KEY_ID = import.meta.env.VITE_TEST_KEY_ID;

  const handleBookingChange = (e) => {
    setSelectedOption(e.target.value);
    setBookingError(false);
  };

  const validateInputs = () => {
    // return mobileNumber.length === 10;

    let isValid = true;
    if (mobileNumber.length !== 10) {
      isValid = false;
    }
    if (!selectedOption) {
      setBookingError(true);
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const booking = {
      mobileNumber: mobileNumber,
      bookingType: selectedOption,
      bookingCategory: serviceName,
      email: localStorage.getItem("Email"),
    };

    console.log("Booking:", booking);
    await handlePayment(booking);
  };

  const saveOrderToUserProfile = async (booking) => {
    try {
      const response = await axios.post(`${URL}/save-order`, booking);

      console.log("Booking information of user", response.data);
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  const handlePayment = async (booking) => {
    try {
      // Step 1: Request an order from backend
      const { data } = await axios.post(`${URL}/create-order`, {
        amount: selectedOption === "on-call" ? 400 : 600, // Amount in paise (₹5.00 = 500 paise)
        currency: "INR",
      });

      const options = {
        key: RAZORPAY_TEST_KEY_ID, // Replace with your Razorpay Key ID
        amount: data.amount,
        currency: data.currency,
        name: "SHADMAN KHAN",
        description: "Payment for Booking",
        order_id: data.id, // Razorpay Order ID from backend
        handler: async (response) => {
          // Step 4: Verify payment on backend
          const verifyResponse = await axios.post(
            `${URL}/verify-payment`,
            response
          );

          if (verifyResponse.data.success) {
            alert("Payment Successful!");
            saveOrderToUserProfile(booking);
            setSuccess(true);
          } else {
            alert("Payment Failed!");
          }
        },
        prefill: {
          name: localStorage.getItem("Username"),
          email: localStorage.getItem("Email"),
          contact: mobileNumber,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };
  const showLoginMsg = (event) => {
    event.preventDefault();
    alert("login to book");
  };

  return (
    <>
      <img
        src={overlayImage}
        alt="overlay"
        className="service-background-overlay"
      />
      <div className="services-overlay-container"></div>

      <div className="signup-container">
        {/* {selectedOption && (
          <div className="qr-box">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
              alt="qr"
              className="qr-img"
            />
          </div>
        )} */}
        <h1 className="login-welcome-text welcome-service-text">
          Navigate life with <label className="adviso-logo">ADVIZO!</label>
        </h1>
        <p className="login-welcome-text login-welcome-text-tagline welcome-service-tagline">
          Smart Choices Start Here!
        </p>
        {success && (
          <div className="success-container">
            <p className="success-text">Thanks for choosing advizo</p>
            <p className="success-text">
              An expert will get back to you within an hour!
            </p>
            <p className="success-text bolder">
              Check your e-mail for more details...
            </p>
          </div>
        )}
        <form onSubmit={isLoggedIn ? handleSubmit : showLoginMsg}>
          <div className="input-wrapper">
            <img src={mobile} alt="Number" className="input-icon" />
            <input
              type="tel"
              placeholder="Enter your number"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              className="input"
              maxLength={10}
            />
          </div>
          {mobileNumber.length > 0 && !isMobileNumberValid && (
            <p className="error-msg">Enter a valid 10-digit Mobile Number</p>
          )}

          <div className="input-wrapper">
            <img
              src={
                !selectedOption
                  ? decision
                  : selectedOption === "on-call"
                  ? call
                  : inPerson
              }
              alt="Number"
              className="input-icon"
            />
            <select
              id="assistance"
              value={selectedOption}
              onChange={handleBookingChange}
              className="input dropdown"
            >
              <option value="" disabled>
                Select an option
              </option>
              <option value="on-call">On Call Assistance</option>
              <option value="in-person">In Person Guidance</option>
            </select>
          </div>
          {bookingError && (
            <p className="error-msg">Select your booking type</p>
          )}
          <div className="input-wrapper">
            <img src={serviceIcon} alt="Furniture" className="input-icon" />
            <input
              type="text"
              value={serviceName}
              className="input password-input"
              readOnly
            />
          </div>

          <button className="signup-submit-btn">Book your call</button>
        </form>
      </div>
    </>
  );
}
