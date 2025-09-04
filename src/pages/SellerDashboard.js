import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import { API_URL } from "../App";
// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const SellerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    contact: "",
    image: null,
  });

  const [editingListing, setEditingListing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

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

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("location", formData.location);
    form.append("price", formData.price);
    form.append("description", formData.description);
    form.append("contact", formData.contact);
    if (formData.image) {
      form.append("image", formData.image, formData.image.name);
    }
    
    try {
      await axios.post(`${API_URL}/api/listings`, form);
      fetchListings();
      setFormData({
        title: "",
        location: "",
        price: "",
        description: "",
        contact: "",
        image: null,
      });
      e.target.reset();
    } catch (error) {
      console.error("Error uploading listing:", error);
    }
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await axios.delete(`${API_URL}/api/listings/${id}`);
      fetchListings();
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const openEditModal = (listing) => {
    setEditingListing(listing);
    setFormData({
      title: listing.title,
      location: listing.location,
      price: listing.price,
      description: listing.description,
      contact: listing.contact || "",
      image: null,
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditingListing(null);
    setShowEditModal(false);
  };

  const handleUpdate = async () => {
    if (!editingListing) return;
    const form = new FormData();
    form.append("title", formData.title);
    form.append("location", formData.location);
    form.append("price", formData.price);
    form.append("description", formData.description);
    form.append("contact", formData.contact);
    if (formData.image) {
      form.append("image", formData.image, formData.image.name);
    }

    try {
      await axios.put(`${API_URL}/api/listings/${editingListing._id}`, form);
      fetchListings();
      closeEditModal();
    } catch (error) {
      console.error("Error updating listing:", error);
    }
  };

  return (
    <div className="page-container">
      <h2>Seller Dashboard</h2>

      {/* Add Listing Form */}
      <form className="listing-form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <input type="text" name="price" placeholder="Price (e.g., $200/night)" value={formData.price} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input type="text" name="contact" placeholder="Contact (phone or email)" value={formData.contact} onChange={handleChange} />
        <input type="file" name="image" onChange={handleChange} />
        <button type="submit">Add Listing</button>
      </form>

      {/* Listings */}
      <div className="listings">
        {listings.map((listing) => (
          <div className="listing-card" key={listing._id}>
            {listing.imageUrl && <img src={`${API_URL}${listing.imageUrl}`} alt={listing.title} />}
            <h3>{listing.title}</h3>
            <p>{listing.location}</p>
            <p>{listing.price}</p>
            <p>{listing.description}</p>
            <p>Contact: {listing.contact}</p>
            <p className={`status ${listing.booked ? "booked" : "available"}`}>
              {listing.booked ? "Booked" : "Available"}
            </p>
            <button onClick={() => deleteListing(listing._id)}>Delete</button>
            <button onClick={() => openEditModal(listing)}>Edit</button>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Listing</h3>
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
            <input type="text" name="location" value={formData.location} onChange={handleChange} />
            <input type="text" name="price" value={formData.price} onChange={handleChange} />
            <textarea name="description" value={formData.description} onChange={handleChange} />
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
            <input type="file" name="image" onChange={handleChange} />
            <button onClick={handleUpdate}>Save</button>
            <button className="close-btn" onClick={closeEditModal}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
