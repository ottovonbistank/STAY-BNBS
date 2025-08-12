// src/pages/LandingPage.js
import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="overlay">
        <h1>Find Your Perfect Stay</h1>
        <p>Book unique homes and experiences all over the world</p>
        <Link to="/login" className="login-btn">Log In</Link>
      </div>
    </div>
  );
};

export default LandingPage;
