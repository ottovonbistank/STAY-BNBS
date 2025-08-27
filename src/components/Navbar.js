import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Sidebar Menu */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ✖
        </button>
        <ul>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          </li>

          {user ? (
            <>
              <li>
                <Link to="/buyer" onClick={() => setIsOpen(false)}>Buyer Dashboard</Link>
              </li>
              <li>
                <Link to="/seller" onClick={() => setIsOpen(false)}>Seller Dashboard</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
              </li>
              <li>
                <Link to="/signup" onClick={() => setIsOpen(false)}>Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
