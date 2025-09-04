import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { API_URL } from "../App";

// const API_URL = "https://api-bookbnb.onrender.com" || "http://localhost:5000";

const BuyerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/listings`);
      setListings(res.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const handleBookListing = async (id) => {
    if (!window.confirm("Are you sure you want to book this listing?")) return;
    try {
      await axios.post(`${API_URL}/api/listings/${id}/book`);
      fetchListings();
      closeModal();
    } catch (error) {
      console.error("Error booking listing:", error);
    }
  };

  const handleUnbookListing = async (id) => {
    if (!window.confirm("Are you sure you want to unbook this listing?")) return;
    try {
      await axios.post(`${API_URL}/api/listings/${id}/unbook`);
      fetchListings();
    } catch (error) {
      console.error("Error unbooking listing:", error);
    }
  };

  const handleProceedToPayment = (listing) => {
    navigate(`/payment/${listing._id}`, { state: { listing } });
  };

  const openModal = (listing) => {
    setSelectedListing(listing);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedListing(null);
    setShowModal(false);
  };

  return (
    <div className="page-container">
      <div className="dashboard">
        <div className="all-listings">
          <h3>All Listings</h3>
          {listings.length === 0 ? (
            <p>No listings at the moment.</p>
          ) : (
            <div className="buyer-listings">
              {listings.map((listing) => (
                <div
                  className="buyer-listing-card"
                  key={listing._id}
                  onClick={() => openModal(listing)}
                >
                  {listing.imageUrl && (
                    <img
                      src={`${API_URL}${listing.imageUrl}`}
                      alt={listing.title}
                    />
                  )}
                  <h3>{listing.title}</h3>
                  <p>{listing.location}</p>
                  <p>{listing.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <hr />

      <div className="booked-listings">
        <h3>Booked Houses</h3>
        {listings.filter((l) => l.booked).length === 0 ? (
          <p>You have not booked any listings yet.</p>
        ) : (
          <div className="buyer-listings">
            {listings
              .filter((l) => l.booked)
              .map((listing) => (
                <div className="buyer-listing-card" key={listing._id}>
                  {listing.imageUrl && (
                    <img
                      src={`${API_URL}${listing.imageUrl}`}
                      alt={listing.title}
                    />
                  )}
                  <h3>{listing.title}</h3>
                  <p>{listing.location}</p>
                  <p>{listing.price}</p>
                  <p className="booked-status">Booked</p>

                  <button onClick={() => handleUnbookListing(listing._id)}>
                    Unbook
                  </button>

                  <button
                    className="payment-btn"
                    onClick={() => handleProceedToPayment(listing)}
                  >
                    Proceed to Payment
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {showModal && selectedListing && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              className="modal-image"
              src={`${API_URL}${selectedListing.imageUrl}`}
              alt={selectedListing.title}
            />
            <h3>{selectedListing.title}</h3>
            <p>{selectedListing.location}</p>
            <p>{selectedListing.price}</p>
            <div className="modal-description">
              <p>{selectedListing.description}</p>
            </div>

            {!selectedListing.booked ? (
              <button onClick={() => handleBookListing(selectedListing._id)}>
                Book Now
              </button>
            ) : (
              <>
                <button disabled>Booked</button>
                <button
                  className="payment-btn"
                  onClick={() => handleProceedToPayment(selectedListing)}
                >
                  Proceed to Payment
                </button>
              </>
            )}

            <button className="close-btn" onClick={closeModal}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
