import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";
import Footer from "../components/Footer";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/createuser`,  {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      if (response.status === 201) {
        setSuccess("User created successfully! Please login.");
        alert("User created successfully! Please login.");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "user",
        });

      
        navigate("/login");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Something went wrong!");
      } else {
        setError("Failed to connect to server.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-200 via-green-100 to-green-200">
  
      <nav className="flex items-center justify-between bg-blue-600 p-4 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-2xl font-bold">PickPlan</h1>
            <p className="text-xs text-blue-100">We choose the best internet plan for you...</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/guest")}
            className="bg-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Guest Recommendation
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </div>
      </nav>

      <div className="flex items-center justify-center flex-1 mt-4">
        <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-gray-200">
          <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-1">PickPlan</h1>
          <p className="text-center text-green-600 mb-6 font-medium text-sm">
            We choose the best internet plan for you...
          </p>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Create Account</h2>

          {error && (
            <div className="mb-6 p-3 text-red-700 bg-red-100 border border-red-300 rounded-lg text-center font-medium animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-3">I am a:</label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.role === "user"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 bg-white hover:border-blue-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === "user"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-1">👤</div>
                    <span className="font-semibold text-gray-700">Normal User</span>
                  </div>
                </label>
                <label
                  className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.role === "provider"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 bg-white hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="provider"
                    checked={formData.role === "provider"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏢</div>
                    <span className="font-semibold text-gray-700">Service Provider</span>
                  </div>
                </label>
              </div>
            </div>

            <input
              type="text"
              name="username"
              placeholder="User Name"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition shadow-sm hover:shadow-md"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition shadow-sm hover:shadow-md"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition shadow-sm hover:shadow-md"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition shadow-sm hover:shadow-md"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
            >
              Signup
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

