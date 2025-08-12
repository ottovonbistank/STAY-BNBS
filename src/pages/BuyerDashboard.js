import React, { useState } from "react";
import "./BuyerDashboard.css";

const BuyerDashboard = () => {
  const listings = [
    {
      id: 1,
      title: "Cozy Beach House",
      location: "Nyali,Mombasa",
      price: "$120/night",
      host: "John Mwangi",
      image: "/beachvilla.jpeg",
      description:
        "A beautiful cozy beach house perfect for families and groups.",
      features: ["3 Bedrooms", "Free WiFi", "Air Conditioning", "Pool Access"],
    },
    {
      id: 2,
      title: "Modern Apartment",
      location: "Kilimani,Nairobi",
      price: "$80/night",
      host: "Mary Wanjiru",
      image: "/nicecrib.jpeg",
      description:
        "Modern apartment located in the heart of the city with all amenities.",
      features: ["2 Bedrooms", "WiFi", "Gym Access", "24/7 Security"],
    },
    {
      id: 3,
      title: "Lake View Cottage",
      location: "Naivasha",
      price: "$150/night",
      host: "Majimaji bnbs",
      image: "/foresthouse.jpeg",
      description:
        "Peaceful lake view cottage surrounded by nature, ideal for relaxation.",
      features: ["2 Bedrooms", "Free Parking", "Boating Access", "Pet Friendly"],
    },
    {
      id: 4,
      title: "Cityview Apartment",
      location: "Adis Ababa",
      price: "$95/night",
      host: "Mutua bnbss",
      image: "/apartment.jpeg",
      description:
        "Comfortable cityview apartment close to business district.",
      features: ["1 Bedroom", "WiFi", "Balcony", "Elevator"],
    },
    {
      id: 5,
      title: "Luxury City Loft",
      location: "Westlands,Nairobi",
      price: "$200/night",
      host: "Shootershub homes",
      image: "/penthouse.jpeg",
      description:
        "Luxury loft with panoramic city views and high-end amenities.",
      features: ["3 Bedrooms", "Jacuzzi", "WiFi", "Private Parking"],
    },
    {
      id: 6,
      title: "Tops apartment",
      location: "Kiambu road,Kiambu",
      price: "$50/night",
      host: "Karibu realtors",
      image: "/modernapartment.jpeg",
      description:
        "Affordable apartment near major highways, perfect for commuters.",
      features: ["1 Bedroom", "WiFi", "Shared Pool", "24/7 Security"],
    },
  ];

  const [selectedListing, setSelectedListing] = useState(null);
  const [nights, setNights] = useState(1);
  const [bookingDate, setBookingDate] = useState("");
  const [bookings, setBookings] = useState([]);

  const openModal = (listing) => {
    setSelectedListing(listing);
    setNights(1);
    setBookingDate("");
  };

  const closeModal = () => {
    setSelectedListing(null);
  };

  const handleBooking = () => {
    if (!bookingDate) {
      alert("Please select a booking date");
      return;
    }

    const newBooking = {
      ...selectedListing,
      nights,
      bookingDate,
      totalPrice:
        parseFloat(selectedListing.price.replace(/[^0-9.]/g, "")) * nights,
    };
    setBookings([...bookings, newBooking]);
    closeModal();
  };

  return (
    <div className="buyer-container">
      <header className="buyer-header">
        <h1>Find Your Perfect Stay</h1>
      </header>

      <div className="dashboard-layout">
        {/* Listings grid */}
        <div className="listings-grid">
          {listings.map((listing) => (
            <div
              className="listing-card"
              key={listing.id}
              onClick={() => openModal(listing)}
            >
              <img src={listing.image} alt={listing.title} />
              <div className="listing-info">
                <h3>{listing.title}</h3>
                <p>{listing.location}</p>
                <p className="host-name">Hosted by {listing.host}</p>
                <span>{listing.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bookings section */}
        <div className="bookings-section">
          <h2>My Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            bookings.map((b, i) => (
              <div key={i} className="booking-item">
                <img src={b.image} alt={b.title} />
                <div>
                  <h4>{b.title}</h4>
                  <p>{b.location}</p>
                  <p className="host-name">Hosted by {b.host}</p>
                  <p>
                    Date: {b.bookingDate} <br />
                    {b.nights} nights — ${b.totalPrice}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedListing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>
              &times;
            </button>
            <img
              src={selectedListing.image}
              alt={selectedListing.title}
              className="modal-image"
            />
            <h2>{selectedListing.title}</h2>
            <p>{selectedListing.location}</p>
            <p className="host-name">Hosted by {selectedListing.host}</p>
            <p>{selectedListing.price}</p>
            <div className="modal-description">
              <p>{selectedListing.description}</p>
              <ul className="features-list">
                {selectedListing.features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
            </div>
            <div className="booking-controls">
              <label>
                Booking Date:
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  style={{ marginLeft: "10px" }}
                />
              </label>
              <br />
              <label>
                Nights:
                <input
                  type="number"
                  min="1"
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                  style={{ marginLeft: "10px" }}
                />
              </label>
            </div>
            <button onClick={handleBooking}>Book Now</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
