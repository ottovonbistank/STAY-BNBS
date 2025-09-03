// Home.js

import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
// ✅ You no longer need to import App.css in this specific component

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>StayBnB</h1>
        <p>Find your next perfect stay or share your own space.</p>
        <div className="button-group">
          <button className="home-btn" onClick={() => navigate("/buyer")}>
            Get a Stay
          </button>
          <button className="home-btn give" onClick={() => navigate("/seller")}>
            Give a Stay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;