import React, { useState } from "react";
import user from "../../assets/Images/user.png";
import mail from "../../assets/Images/mail.png";
import password from "../../assets/Images/password.png";
import view from "../../assets/Images/view.png";
import google from "../../assets/Images/google.png";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Signup({ setIsLoggedIn }) {
  const URL = import.meta.env.VITE_BASE_URL;
  const NEW_USER_PASSWORD = import.meta.env.VITE_PASSWORD;
  const navigate = useNavigate();
  const [failure, setFailure] = useState(false);
  const [inputValues, setInputValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [inputError, setInputError] = useState({
    nameError: false,
    emailError: false,
    passwordError: false,
  });
  const [passFlag, setPassFlag] = useState(false);

  const handleInputChange = (event, identifier) => {
    setInputValues((prev) => ({
      ...prev,
      [identifier]: event.target.value,
    }));

    if (identifier === "password") {
      const isValidPassword = event.target.value.length >= 5;
      setInputError((prev) => ({
        ...prev,
        passwordError: !isValidPassword,
      }));
    } else if (identifier === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(event.target.value);
      setInputError((prev) => ({
        ...prev,
        emailError: !isValidEmail,
      }));
    } else {
      const errorToSet = identifier + "Error";
      setInputError((prev) => ({
        ...prev,
        [errorToSet]: false,
      }));
    }
  };

  const handleViewClick = () => {
    setPassFlag((prev) => !prev);
  };

  const validateInputs = () => {
    let isValid = true;
    if (!inputValues.name) {
      setInputError((prev) => ({
        ...prev,
        ["nameError"]: true,
      }));
      isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputValues.email || !emailRegex.test(inputValues.email)) {
      setInputError((prev) => ({
        ...prev,
        emailError: true,
      }));
      isValid = false;
    }
    if (!inputValues.password || inputValues.password.length <= 5) {
      setInputError((prev) => ({
        ...prev,
        ["passwordError"]: true,
      }));
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) {
      console.log("Invalid User");
      return;
    }
    const user = {
      name: inputValues.name,
      email: inputValues.email,
      password: inputValues.password,
    };
    try {
      const response = await axios.post(`${URL}/signup`, user, {
        withCredentials: true,
      });
      console.log("Response from Backend ", response);
      if (response.status === 200) {
        localStorage.setItem("Username", response.data.name);
        localStorage.setItem("Email", response.data.email);
        setIsLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      setFailure(true);
      console.log("Error logging in", error);
    }
  };

  const handleGoogleLoginSubmit = async (user) => {
    try {
      const response = await axios.post(`${URL}/login-google`, user, {
        withCredentials: true,
      });
      console.log("Response from Backend ", response);
      if (response.status === 200) {
        localStorage.setItem("Username", response.data.name);
        localStorage.setItem("Email", response.data.email);
        setIsLoggedIn(true);
        navigate("/");
      }
    } catch (error) {
      setFailure(true);
      console.log("Error logging in", error);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Token:", tokenResponse);

      // Fetch user profile using the access token
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }
      );

      console.log("User Info:", userInfo.data);
      const user = {
        name: userInfo.data.name,
        email: userInfo.data.email,
        password: NEW_USER_PASSWORD,
      };

      handleGoogleLoginSubmit(user);
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
    },
  });

  return (
    <>
      <div className="signup-container">
        <h1 className="signup-welcome-text">
          Welcome to <label className="adviso-logo">ADVIZO</label> – Your
          Personal Shopping Guide!
        </h1>
        {failure && (
          <div className="error-container">
            <p className="error-text">Error registering user</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <img src={user} alt="user" className="input-icon" />
            <input
              type="text"
              placeholder="Name"
              value={inputValues.name}
              onChange={(event) => handleInputChange(event, "name")}
              className="input"
            />
          </div>
          {inputError.nameError && (
            <p className="error-msg">Name is required</p>
          )}
          <div className="input-wrapper">
            <img src={mail} alt="mail" className="input-icon" />
            <input
              type="text"
              placeholder="Email"
              value={inputValues.email}
              onChange={(event) => handleInputChange(event, "email")}
              className="input"
            />
          </div>
          {inputError.emailError && (
            <p className="error-msg">Enter a valid Email address</p>
          )}
          <div className="input-wrapper">
            <img src={password} alt="password" className="input-icon" />
            <input
              type={passFlag ? "text" : "password"}
              placeholder="Password"
              value={inputValues.password}
              onChange={(event) => handleInputChange(event, "password")}
              className="input password-input"
            />
            <img
              onClick={handleViewClick}
              src={view}
              alt="view"
              className="view-icon"
            />
          </div>
          {inputError.passwordError && (
            <p className="error-msg">
              Password must be grater than 5 charcters
            </p>
          )}
          <button className="signup-submit-btn">Sign Up</button>
        </form>
        <p className="sign-up-text">Or</p>
        <button className="google-login-btn" onClick={handleGoogleLogin}>
          <img src={google} alt="google" className="google-login-icon" /> Login
          with Google
        </button>
        <p className="signup-text ">
          Already Registered?
          <Link to="/login" className="link">
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
