import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../utils/constant";

export default function ProfilePage({ handleLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get(`${User}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (err) {
        console.error("Fetch user error:", err);
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
    };

    fetchUser();
  }, [navigate]);

  // Logout and redirect
  const onLogout = () => {
    handleLogout();
    navigate("/login");
  };

  if (!user) {
    return null; // or a “No user” message
  }

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>

      <div className="space-y-4">
        <p>
          <span className="font-semibold">Name:</span> {user.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        {user.phone && (
          <p>
            <span className="font-semibold">Phone:</span> {user.phone}
          </p>
        )}
        {user.role && (
          <p>
            <span className="font-semibold">Role:</span> {user.role}
          </p>
        )}
        {/* add more fields as needed */}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onLogout}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
