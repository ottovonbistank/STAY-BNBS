import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";

function PaymentPage() {
  const navigate = useNavigate();

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h2>Proceed with Payment</h2>
        <p>Select a payment method to complete your booking.</p>

        <div className="payment-options">
          <button className="payment-option-btn mpesa">Pay with M-Pesa</button>
          <button className="payment-option-btn">Pay with Card</button>
        </div>

        <button className="back-btn" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
      </div>
    </div>
  );
}

export default PaymentPage;
