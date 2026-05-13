import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import { buildAuthHeaders, clearAuthTokens, getApiToken } from "../config/auth";

// Profile endpoint goes directly to backend, not through gateway
const PROFILE_BASE_URL = process.env.REACT_APP_AUTH_API_URL || "http://localhost:4000/api";

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const apiToken = getApiToken();

  useEffect(() => {
    console.log("Profile Page - Token Debug:", {
      localToken: token ? "exists" : "missing",
      apiToken: apiToken ? apiToken.substring(0, 20) + "..." : "missing",
      access_token: localStorage.getItem("access_token") ? "exists" : "missing",
      user: localStorage.getItem("user")
    });
    
    if (!token) {
      navigate("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserData(user);
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Use local token (contains MongoDB user ID) for profile operations, not WSO2 token
    const localToken = localStorage.getItem("token");
    const headers = buildAuthHeaders(localToken);

    console.log("=== Profile Update Request ===");
    console.log("Using local JWT token for profile update (contains MongoDB user ID)");
    console.log("Headers:", headers);

    try {
      const response = await axios.put(
        `${PROFILE_BASE_URL}/profile`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password || undefined,
        },
        {
          headers: headers,
        }
      );
      console.log("Response status:", response.status);

      if (response.status === 200) {
        setSuccess("Profile updated successfully!");
        setUserData(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        const localToken = localStorage.getItem("token");
        const headers = buildAuthHeaders(localToken);
        await axios.delete(`${PROFILE_BASE_URL}/delete`, {
          headers: headers,
        });
        alert("Account deleted successfully");
        clearAuthTokens();
        navigate("/login");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete account");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-200 via-green-100 to-green-200">

      <nav className="flex items-center justify-between bg-blue-600 p-4 text-white shadow-lg">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <button
          onClick={() => navigate("/user-home")}
          className="bg-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Back to Home
        </button>
      </nav>

    
      <div className="flex-1 container mx-auto px-4 py-10 mt-4">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
          {error && (
            <div className="mb-6 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 text-green-700 bg-green-100 border border-green-300 rounded-lg text-center font-medium">
              {success}
            </div>
          )}

          {!isEditing ? (
            <div>
              <div className="space-y-6 mb-6">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Username</p>
                  <p className="text-2xl font-bold text-blue-600">{userData?.username}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Email</p>
                  <p className="text-xl font-semibold text-gray-800">{userData?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Account Type</p>
                  <p className="text-xl font-semibold text-gray-800">Normal User</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-lg mb-4"
              >
                Edit Profile
              </button>

              <button
                onClick={handleDeleteAccount}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
              >
                Delete Account
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">New Password (Optional)</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Leave blank to keep current password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-400 text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-500 transition-all shadow-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
