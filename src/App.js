import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SellerDashboard from "./pages/SellerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import PaymentPage from "./pages/PaymentPage";
import Navbar from "./components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export const API_URL = "https://api-bookbnb-1.onrender.com" ;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <Router>
      {/* ✅ Navbar must be INSIDE Router */}
      <Navbar user={user} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />

        {/* Protected routes */}
        <Route
          path="/seller"
          element={user ? <SellerDashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/buyer"
          element={user ? <BuyerDashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/payment/:id"
          element={user ? <PaymentPage /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

