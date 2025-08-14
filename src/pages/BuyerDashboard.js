import React, { useEffect, useState } from "react";
import "./Dashboard.css";

export default function BuyersDashboard() {
  const [listings, setListings] = useState([]);
  const [nights, setNights] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/api/listings")
      .then(res => res.json())
      .then(data => setListings(data))
      .catch(err => console.error(err));
  }, []);

  const handleBooking = (id) => {
    fetch(`http://localhost:5000/api/book/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nights: nights[id] || 1 })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) alert(data.error);
        else {
          alert("Booking successful");
          setListings(prev => prev.map(l => l._id === id ? { ...l, booked: true, bookingDetails: { nights: nights[id] || 1 } } : l));
        }
      }).catch(err => console.error(err));
  };

  return (
    <div className="dashboard-container">
      <h1>Available Listings</h1>
      <div className="listings-grid">
        {listings.map(l => (
          <div className="listing-card" key={l._id}>
            <img src={`http://localhost:5000${l.imageUrl}`} alt={l.title} />
            <div className="card-body">
              <h3>{l.title}</h3>
              <p>{l.location}</p>
              <p>{l.price}</p>
              <p>{l.description}</p>
              {!l.booked ? (
                <div className="booking-section">
                  <input type="number" min="1" value={nights[l._id] || ""} onChange={(e) => setNights({ ...nights, [l._id]: e.target.value })} />
                  <button onClick={() => handleBooking(l._id)}>Book Now</button>
                </div>
              ) : <span className="booked-label">Booked</span>}
            </div>
          </div>
        ))}
      </div>
      <h2>My Bookings</h2>
      {listings.filter(l => l.booked).map(l => (
        <div className="listing-card" key={l._id}>
          <img src={`http://localhost:5000${l.imageUrl}`} alt={l.title} />
          <div className="card-body">
            <h3>{l.title}</h3>
            <p>{l.location}</p>
            <p>{l.price}</p>
            <p>{l.description}</p>
            <p>Nights: {l.bookingDetails.nights}</p>
            <span className="booked-label">Booked</span>
          </div>
        </div>
      ))}
    </div>
  );
}
