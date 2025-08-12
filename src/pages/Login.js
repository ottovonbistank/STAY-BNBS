import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("buyer"); // default role
  const navigate = useNavigate();

  const handleLogin = () => {
    const userData = { name: username, role };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // save user data
    localStorage.setItem("token", "fakeToken");

    if (role === "seller") {
      navigate("/seller");
    } else {
      navigate("/buyer");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="buyer">Buyer</option>
        <option value="seller">Seller</option>
      </select>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
