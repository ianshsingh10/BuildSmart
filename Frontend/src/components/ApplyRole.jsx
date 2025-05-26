import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "../utils/constant";

export default function ApplyRole() {
  const [user, setUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("seller");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${User}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        navigate("/login"); // Redirect if token is invalid or expired
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.put(
        `${User}/role`,
        { role: selectedRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus("success");

      const updatedUser = res.data?.user;
      if (updatedUser) {
        localStorage.setItem("role", updatedUser.role);
        setUser(updatedUser);
      } else {
        localStorage.setItem("role", selectedRole); // fallback
      }

    } catch (err) {
      console.error("Failed to update role:", err);
      setStatus("error");

      // Still store selected role locally in case of API error
      localStorage.setItem("role", selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="text-indigo-600 font-medium mb-4 inline-flex items-center hover:underline"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Partner with Us
        </h2>

        {status === "success" && (
          <div className="text-green-600 mb-4 font-semibold">
            ✅ Application submitted successfully!
          </div>
        )}
        {status === "error" && (
          <div className="text-red-600 mb-4 font-semibold">
            ❌ Failed to submit. Please try again.
          </div>
        )}

        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Select Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="seller">Seller</option>
                <option value="delivery">Delivery Partner</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
            >
              Apply
            </button>
          </form>
        ) : (
          <div className="text-gray-500">Loading user data...</div>
        )}
      </div>
    </div>
  );
}
