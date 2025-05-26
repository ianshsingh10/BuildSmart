import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { User } from "../utils/constant";

function Login({ setIsLoggedIn, setUsername }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const saveAndRedirect = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.user.name);
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("userId", data.user._id);
    setIsLoggedIn(true);
    setUsername(data.user.name);
    navigate("/dashboard");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${User}/login`, { email, password });
      saveAndRedirect(data);
      alert("Login Successful!");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const tokenId = credentialResponse.credential;
      const { data } = await axios.post(`${User}/google`, { tokenId });
      saveAndRedirect(data);
      alert("Google login successful!");
    } catch (err) {
      console.error("Google login error:", err);
      alert(err.response?.data?.message || "Google login failed");
    }
  };

  const handleGoogleError = () => {
    alert("Google login was unsuccessful. Please try again.");
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500">OR</p>
        </div>

        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <div className="mt-6 text-center">
          <p>Don't have an account?</p>
          <button
            onClick={handleRegisterRedirect}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-2"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
