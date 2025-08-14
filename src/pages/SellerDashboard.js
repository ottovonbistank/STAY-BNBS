import React, { useEffect, useState } from "react";
import "./Dashboard.css";

function SellerDashboard() {
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    description: "",
    image: null,
  });

  const fetchListings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/listings");
      const data = await res.json();
      setListings(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") setFormData({ ...formData, image: e.target.files[0] });
    else setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("Please select an image.");

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      const res = await fetch("http://localhost:5000/api/listings", { method: "POST", body: data });
      const result = await res.json();
      if (!res.ok) alert(result.error || "Error");
      else { alert(result.message); setFormData({ title: "", location: "", price: "", description: "", image: null }); fetchListings(); }
    } catch (err) { console.error(err); alert("Upload error"); }
  };

  const deleteListing = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) alert(result.error || "Error");
      else setListings(listings.filter(l => l._id !== id));
    } catch (err) { console.error(err); alert("Delete error"); }
  };

  return (
    <div className="dashboard-container">
      <h1>Seller Dashboard</h1>
      <form className="listing-form" onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input type="text" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="file" name="image" accept="image/*" onChange={handleChange} required />
        <button type="submit">Upload Listing</button>
      </form>

      <h2>Your Listings</h2>
      <div className="listings-grid">
        {listings.map(l => (
          <div className="listing-card" key={l._id}>
            <img src={`http://localhost:5000${l.imageUrl}`} alt={l.title} />
            <div className="card-body">
              <h3>{l.title}</h3>
              <p>{l.location}</p>
              <p>{l.price}</p>
              <p>{l.description}</p>
              <button onClick={() => deleteListing(l._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SellerDashboard;
