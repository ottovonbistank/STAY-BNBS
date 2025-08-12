import React from "react";
import "./Dashboard.css";

const SellerDashboard = () => {
  return (
    <div className="dashboard">
      <h2>Your Listings</h2>
      <div className="card-container">
        <div className="card">
          <img src="https://source.unsplash.com/400x250/?apartment" alt="Listing" />
          <h3>Luxury Apartment in Nairobi</h3>
          <p>KES 5,000/night</p>
        </div>
        <div className="card">
          <img src="https://source.unsplash.com/400x250/?villa" alt="Listing" />
          <h3>Beachfront Villa</h3>
          <p>KES 12,000/night</p>
        </div>
        <div className="card">
          <img src="https://source.unsplash.com/400x250/?cabin" alt="Listing" />
          <h3>Cozy Mountain Cabin</h3>
          <p>KES 8,000/night</p>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
