import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import Footer from "../components/Footer";

const UserHome = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [recommendedPackage, setRecommendedPackage] = useState(null);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceProviders, setServiceProviders] = useState(["Mobitel", "Hutch", "Dialog"]);
  const [hasRecommended, setHasRecommended] = useState(false);

  const [formData, setFormData] = useState({
    serviceProvider: "Mobitel",
    anytimeData: 5,
    nightData: 2,
    callMinutes: 100,
    sms: 50,
    budget: 1000,
    socialMedia: [],
  });

  const availableSocialMedia = ["WhatsApp", "Facebook", "Instagram", "YouTube", "TikTok", "Twitter"];

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    fetchPackages();
  }, [token, navigate, formData.serviceProvider]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/packages/${formData.serviceProvider}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPackages(response.data);
      setFilteredPackages(response.data);
      setRecommendedPackage(null);
      setHasRecommended(false);
    } catch (error) {
      console.log("Could not fetch packages - displaying demo data");
      setPackages([
        {
          _id: "1",
          name: "Basic Plan",
          validationTime: 30,
          anytimeData: 5,
          nightTimeData: 2,
          callMinutes: 100,
          sms: 50,
          price: 500,
          serviceProvider: formData.serviceProvider,
          socialMedia: ["WhatsApp", "Facebook"],
          coverImage: "",
        },
        {
          _id: "2",
          name: "Standard Plan",
          validationTime: 30,
          anytimeData: 10,
          nightTimeData: 5,
          callMinutes: 200,
          sms: 100,
          price: 800,
          serviceProvider: formData.serviceProvider,
          socialMedia: ["Instagram", "YouTube"],
          coverImage: "",
        },
        {
          _id: "3",
          name: "Premium Plan",
          validationTime: 30,
          anytimeData: 20,
          nightTimeData: 10,
          callMinutes: 500,
          sms: 200,
          price: 1500,
          serviceProvider: formData.serviceProvider,
          socialMedia: ["WhatsApp", "Facebook", "YouTube"],
          coverImage: "",
        },
      ]);
      setFilteredPackages([
        {
          _id: "1",
          name: "Basic Plan",
          validationTime: 30,
          anytimeData: 5,
          nightTimeData: 2,
          callMinutes: 100,
          sms: 50,
          price: 500,
          serviceProvider: formData.serviceProvider,
          socialMedia: ["WhatsApp", "Facebook"],
          coverImage: "",
        },
        {
          _id: "2",
          name: "Standard Plan",
          validationTime: 30,
          anytimeData: 10,
          nightTimeData: 5,
          callMinutes: 200,
          sms: 100,
          price: 800,
          serviceProvider: formData.serviceProvider,
          socialMedia: ["Instagram", "YouTube"],
          coverImage: "",
        },
        {
          _id: "3",
          name: "Premium Plan",
          validationTime: 30,
          anytimeData: 20,
          nightTimeData: 10,
          callMinutes: 500,
          sms: 200,
          price: 1500,
          serviceProvider: formData.serviceProvider,
          socialMedia: ["WhatsApp", "Facebook", "YouTube"],
          coverImage: "",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || value });
  };

  const handleSocialMediaChange = (platform) => {
    const updated = formData.socialMedia.includes(platform)
      ? formData.socialMedia.filter((p) => p !== platform)
      : [...formData.socialMedia, platform];
    setFormData({ ...formData, socialMedia: updated });
  };

  const recommendPackage = () => {
    if (packages.length === 0) {
      alert("No packages available for this service provider.");
      return;
    }

    // Calculate closeness score for ALL packages
    const scored = packages.map((pkg) => {
      let score = 0;

      // Anytime Data closeness (weight: 20%)
      const anytimeDataRatio = formData.anytimeData > 0 
        ? Math.min(pkg.anytimeData, formData.anytimeData) / formData.anytimeData
        : 1;
      const anytimeDataPenalty = pkg.anytimeData < formData.anytimeData 
        ? (formData.anytimeData - pkg.anytimeData) / formData.anytimeData 
        : 0;
      score += (anytimeDataRatio - anytimeDataPenalty * 0.5) * 0.2;

      // Night Data closeness (weight: 10%)
      const nightDataRatio = formData.nightData > 0
        ? Math.min(pkg.nightTimeData, formData.nightData) / formData.nightData
        : 1;
      const nightDataPenalty = pkg.nightTimeData < formData.nightData
        ? (formData.nightData - pkg.nightTimeData) / formData.nightData
        : 0;
      score += (nightDataRatio - nightDataPenalty * 0.5) * 0.1;

      // Call Minutes closeness (weight: 20%)
      const callRatio = formData.callMinutes > 0
        ? Math.min(pkg.callMinutes, formData.callMinutes) / formData.callMinutes
        : 1;
      const callPenalty = pkg.callMinutes < formData.callMinutes
        ? (formData.callMinutes - pkg.callMinutes) / formData.callMinutes
        : 0;
      score += (callRatio - callPenalty * 0.5) * 0.2;

      // SMS closeness (weight: 10%)
      const smsRatio = formData.sms > 0
        ? Math.min(pkg.sms, formData.sms) / formData.sms
        : 1;
      const smsPenalty = pkg.sms < formData.sms
        ? (formData.sms - pkg.sms) / formData.sms
        : 0;
      score += (smsRatio - smsPenalty * 0.5) * 0.1;

      // Price closeness (weight: 30%) - closer to budget is better
      const priceDiff = Math.abs(pkg.price - formData.budget);
      const maxPriceDiff = formData.budget;
      const priceScore = 1 - (priceDiff / maxPriceDiff);
      score += Math.max(0, priceScore) * 0.3;

      // Social Media match (weight: 10%)
      let socialMediaScore = 1;
      if (formData.socialMedia.length > 0) {
        const matchedPlatforms = formData.socialMedia.filter((platform) =>
          (pkg.socialMedia || []).includes(platform)
        );
        socialMediaScore = matchedPlatforms.length / formData.socialMedia.length;
      }
      score += socialMediaScore * 0.1;

      return { ...pkg, score };
    });

    // Sort by score (highest first) and get the best match
    scored.sort((a, b) => b.score - a.score);
    setRecommendedPackage(scored[0]);
    
    // Show all packages except the recommended one
    const otherPackages = scored.slice(1);
    setFilteredPackages(otherPackages);
    setHasRecommended(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-200 via-green-100 to-green-200">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-blue-600 p-4 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold">PickPlan</h1>
        </div>
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => navigate("/user-profile")}
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
        {/* Recommendation Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Find Your Perfect Package</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Service Provider</label>
              <select
                name="serviceProvider"
                value={formData.serviceProvider}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                {serviceProviders.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Anytime Data (GB): {formData.anytimeData}
              </label>
              <input
                type="range"
                name="anytimeData"
                min="1"
                max="50"
                value={formData.anytimeData}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Night Data (GB): {formData.nightData}
              </label>
              <input
                type="range"
                name="nightData"
                min="1"
                max="30"
                value={formData.nightData}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Call Minutes: {formData.callMinutes}
              </label>
              <input
                type="range"
                name="callMinutes"
                min="10"
                max="1000"
                step="10"
                value={formData.callMinutes}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                SMS: {formData.sms}
              </label>
              <input
                type="range"
                name="sms"
                min="10"
                max="500"
                step="10"
                value={formData.sms}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Budget (Rs): {formData.budget}
              </label>
              <input
                type="range"
                name="budget"
                min="100"
                max="5000"
                step="100"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>
          </div>

          {/* Social Media Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">Social Media Platforms (Optional)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {availableSocialMedia.map((platform) => (
                <label
                  key={platform}
                  className="flex items-center space-x-2 cursor-pointer bg-gray-50 hover:bg-blue-50 p-3 rounded-lg border border-gray-200 transition"
                >
                  <input
                    type="checkbox"
                    checked={formData.socialMedia.includes(platform)}
                    onChange={() => handleSocialMediaChange(platform)}
                    className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-sm font-medium text-gray-700">{platform}</span>
                </label>
              ))}
            </div>
            {formData.socialMedia.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {formData.socialMedia.join(", ")}
              </p>
            )}
          </div>

          <button
            onClick={recommendPackage}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-lg"
          >
            Get Recommendation
          </button>
        </div>

        {/* Recommended Package */}
        {recommendedPackage && (
          <div className="bg-yellow-50 rounded-3xl shadow-2xl p-8 mb-10 border-4 border-yellow-400">
            <h3 className="text-2xl font-bold text-yellow-600 mb-4">⭐ Recommended Package</h3>
            {recommendedPackage.coverImage && (
              <img
                src={recommendedPackage.coverImage}
                alt={recommendedPackage.name}
                className="w-full max-h-64 object-cover rounded-2xl mb-6 border border-yellow-200"
              />
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-gray-600 text-sm">Anytime Data</p>
                <p className="text-2xl font-bold text-blue-600">{recommendedPackage.anytimeData} GB</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Night Data</p>
                <p className="text-2xl font-bold text-blue-600">{recommendedPackage.nightTimeData} GB</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Call Minutes</p>
                <p className="text-2xl font-bold text-blue-600">{recommendedPackage.callMinutes}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Price</p>
                <p className="text-2xl font-bold text-green-600">Rs {recommendedPackage.price}</p>
              </div>
            </div>
            <div className="mt-6 text-gray-700">
              <p><span className="font-semibold">Service Provider:</span> {recommendedPackage.serviceProvider}</p>
              <p><span className="font-semibold">Validation:</span> {recommendedPackage.validationTime} Days</p>
              <p><span className="font-semibold">SMS:</span> {recommendedPackage.sms}</p>
              <p><span className="font-semibold">Social Media:</span> {recommendedPackage.socialMedia?.length ? recommendedPackage.socialMedia.join(", ") : "None"}</p>
            </div>
          </div>
        )}

        {/* All Packages */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-blue-600 mb-6">
            {hasRecommended ? "Suitable Packages" : "Available Packages"}
          </h3>

          {loading ? (
            <p className="text-center text-gray-600">Loading packages...</p>
          ) : filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg._id}
                  className={`rounded-2xl p-6 shadow-lg transition-all ${
                    recommendedPackage?._id === pkg._id
                      ? "border-4 border-yellow-400 bg-yellow-50"
                      : "border border-gray-300 bg-white hover:shadow-xl"
                  }`}
                >
                  {pkg.coverImage && (
                    <img
                      src={pkg.coverImage}
                      alt={pkg.name}
                      className="w-full h-40 object-cover rounded-xl mb-4 border border-gray-200"
                    />
                  )}
                  <h4 className="text-xl font-bold text-blue-600 mb-4">{pkg.name}</h4>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between">
                      <span>Service Provider:</span>
                      <span className="font-semibold">{pkg.serviceProvider}</span>
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
                        {pkg.socialMedia && pkg.socialMedia.length > 0 ? pkg.socialMedia.join(", ") : "None"}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3 mt-3">
                      <span className="font-bold">Price:</span>
                      <span className="text-green-600 font-bold text-lg">Rs {pkg.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              {hasRecommended
                ? "No packages match your criteria."
                : "Select a service provider to view packages."}
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserHome;
