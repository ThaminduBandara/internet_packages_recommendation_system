import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import Footer from "../components/Footer";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPackages: 0,
    activePackages: 0,
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token || (user.role !== "provider" && user.role !== "admin")) {
      navigate("/login");
    }
    fetchPackages();
  }, [token, navigate, user.role]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/packages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPackages(response.data);
      setStats({
        totalPackages: response.data.length,
        activePackages: response.data.length,
      });
    } catch (error) {
      console.log("Demo data loaded");
      const demoData = [
        {
          _id: "1",
          name: "Starter",
          validationTime: 30,
          price: 500,
          anytimeData: 5,
          nightTimeData: 2,
          callMinutes: 100,
          sms: 50,
          serviceProvider: "Demo Provider",
          socialMedia: ["WhatsApp", "Facebook"],
          coverImage: "",
        },
        {
          _id: "2",
          name: "Professional",
          validationTime: 30,
          price: 1000,
          anytimeData: 20,
          nightTimeData: 10,
          callMinutes: 500,
          sms: 200,
          serviceProvider: "Demo Provider",
          socialMedia: ["YouTube", "Instagram"],
          coverImage: "",
        },
      ];
      setPackages(demoData);
      setStats({
        totalPackages: demoData.length,
        activePackages: demoData.length,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDeletePackage = async (packageId) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/packages/${packageId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPackages(packages.filter((pkg) => pkg._id !== packageId));
        alert("Package deleted successfully");
      } catch (error) {
        alert("Failed to delete package");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-200 via-green-100 to-green-200">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-blue-600 p-4 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">PickPlan Provider Dashboard</h1>
          <h1 className="text-2xl font-bold">Service Provider Dashboard</h1>
        </div>
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => navigate("/provider-profile")}
          >
            Profile
          </button>
          <button
            className="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
            <h3 className="text-gray-600 text-lg mb-2">Total Packages</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.totalPackages}</p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
            <h3 className="text-gray-600 text-lg mb-2">Active Packages</h3>
            <p className="text-4xl font-bold text-green-600">{stats.activePackages}</p>
          </div>
        </div>

        {/* Add Package Button */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => navigate("/add-package")}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-lg"
          >
            + Add New Package
          </button>
        </div>

        {/* Packages List */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Your Packages</h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading packages...</p>
          ) : packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="rounded-2xl p-6 shadow-lg border border-gray-300 bg-white hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => navigate(`/package-view/${pkg._id}`)}
                >
                  {pkg.coverImage && (
                    <img
                      src={pkg.coverImage}
                      alt={pkg.name}
                      className="w-full h-40 object-cover rounded-xl mb-4 border border-gray-200"
                    />
                  )}
                  <h4 className="text-xl font-bold text-blue-600 mb-4">{pkg.name}</h4>
                  <div className="space-y-2 text-gray-700 mb-6">
                    <div className="flex justify-between">
                      <span>Service Provider:</span>
                      <span className="font-semibold">{pkg.serviceProvider || user.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Validation:</span>
                      <span className="font-semibold">{pkg.validationTime} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Anytime Data:</span>
                      <span className="font-semibold">{pkg.anytimeData} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Night Data:</span>
                      <span className="font-semibold">{pkg.nightTimeData} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Call Minutes:</span>
                      <span className="font-semibold">{pkg.callMinutes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SMS:</span>
                      <span className="font-semibold">{pkg.sms}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">Social Media:</span>
                      <span className="text-sm text-gray-600">
                        {pkg.socialMedia && pkg.socialMedia.length > 0
                          ? pkg.socialMedia.join(", ")
                          : "None"}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3 mt-3">
                      <span className="font-bold">Price:</span>
                      <span className="text-green-600 font-bold">Rs {pkg.price}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/edit-package/${pkg._id}`);
                      }}
                      className="flex-1 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePackage(pkg._id);
                      }}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No packages yet. Create one to get started!</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProviderDashboard;
