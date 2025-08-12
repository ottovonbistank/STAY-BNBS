import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="hamburger"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar Menu */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ✖
        </button>
        <ul>
          <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/buyer" onClick={() => setIsOpen(false)}>Buyer Dashboard</Link></li>
          <li><Link to="/seller" onClick={() => setIsOpen(false)}>Seller Dashboard</Link></li>
          <li><Link to="/login" onClick={() => setIsOpen(false)}>Login</Link></li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
