import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import { buildAuthHeaders, clearAuthTokens, getApiToken } from "../config/auth";

const PUBLIC_API_BASE_URL = process.env.REACT_APP_PUBLIC_API_URL || "http://localhost:4000/api";

const UserHome = () => {
  const navigate = useNavigate();
  const [allPackages, setAllPackages] = useState([]);
  const [packages, setPackages] = useState([]);
  const [recommendedPackage, setRecommendedPackage] = useState(null);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [hasRecommended, setHasRecommended] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    serviceProvider: "",
    anytimeData: 5,
    nightData: 2,
    callMinutes: 100,
    sms: 50,
    budget: 1000,
    socialMedia: [],
  });

  const availableSocialMedia = ["WhatsApp", "Facebook", "Instagram", "YouTube", "TikTok", "Twitter"];

  const token = localStorage.getItem("token");
  const apiToken = getApiToken();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadPackages = async () => {
      try {
        setLoading(true);
        setError("");

        // Use WSO2 gateway endpoint with access token
        const gatewayUrl = "http://localhost:8280/packages/v1/v1/packages";
        console.log("📡 Requesting packages from:", gatewayUrl);
        console.log("🔐 Access token present:", !!apiToken);
        if (apiToken) {
          console.log("🔐 Token (first 50 chars):", apiToken.substring(0, 50) + "...");
        }

        const response = await axios.get(gatewayUrl, {
          headers: buildAuthHeaders(apiToken)
        });

        console.log("✅ Gateway response received, status:", response.status, "packages count:", response.data?.length || 0);
        const availablePackages = Array.isArray(response.data) ? response.data : [];
        const providers = Array.from(
          new Set(availablePackages.map((pkg) => pkg.serviceProvider).filter(Boolean))
        );

        setAllPackages(availablePackages);
        setServiceProviders(providers);

        setFormData((prev) => ({
          ...prev,
          serviceProvider:
            prev.serviceProvider && providers.includes(prev.serviceProvider)
              ? prev.serviceProvider
              : providers[0] || "",
        }));
      } catch (loadError) {
        console.error("Failed to load packages", loadError);
        setError("Could not load packages from the database.");
        setAllPackages([]);
        setServiceProviders([]);
        setPackages([]);
        setFilteredPackages([]);
      } finally {
        setLoading(false);
      }
    };

    loadPackages();
  }, [token, navigate, apiToken]);

  useEffect(() => {
    if (allPackages.length === 0 || !formData.serviceProvider) {
      setPackages([]);
      setFilteredPackages([]);
      return;
    }

    const selectedPackages = allPackages.filter(
      (pkg) => pkg.serviceProvider === formData.serviceProvider
    );

    setPackages(selectedPackages);
    setFilteredPackages(selectedPackages);
    setRecommendedPackage(null);
    setHasRecommended(false);
  }, [allPackages, formData.serviceProvider]);

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

    const scored = packages.map((pkg) => {
      let score = 0;

      const anytimeDataRatio = formData.anytimeData > 0
        ? Math.min(pkg.anytimeData, formData.anytimeData) / formData.anytimeData
        : 1;
      const anytimeDataPenalty = pkg.anytimeData < formData.anytimeData
        ? (formData.anytimeData - pkg.anytimeData) / formData.anytimeData
        : 0;
      score += (anytimeDataRatio - anytimeDataPenalty * 0.5) * 0.2;

      const nightDataRatio = formData.nightData > 0
        ? Math.min(pkg.nightTimeData, formData.nightData) / formData.nightData
        : 1;
      const nightDataPenalty = pkg.nightTimeData < formData.nightData
        ? (formData.nightData - pkg.nightTimeData) / formData.nightData
        : 0;
      score += (nightDataRatio - nightDataPenalty * 0.5) * 0.1;

      const callRatio = formData.callMinutes > 0
        ? Math.min(pkg.callMinutes, formData.callMinutes) / formData.callMinutes
        : 1;
      const callPenalty = pkg.callMinutes < formData.callMinutes
        ? (formData.callMinutes - pkg.callMinutes) / formData.callMinutes
        : 0;
      score += (callRatio - callPenalty * 0.5) * 0.2;

      const smsRatio = formData.sms > 0
        ? Math.min(pkg.sms, formData.sms) / formData.sms
        : 1;
      const smsPenalty = pkg.sms < formData.sms
        ? (formData.sms - pkg.sms) / formData.sms
        : 0;
      score += (smsRatio - smsPenalty * 0.5) * 0.1;

      const priceDiff = Math.abs(pkg.price - formData.budget);
      const priceScore = 1 - (priceDiff / formData.budget);
      score += Math.max(0, priceScore) * 0.3;

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

    scored.sort((a, b) => b.score - a.score);
    setRecommendedPackage(scored[0]);
    setFilteredPackages(scored.slice(1));
    setHasRecommended(true);
  };

  const handleLogout = () => {
    clearAuthTokens();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-200 via-green-100 to-green-200">
      <nav className="flex items-center justify-between bg-blue-600 p-4 text-white shadow-lg">
        <div>
          <h1 className="text-2xl font-bold">PickPlan</h1>
          <p className="text-xs text-blue-100">We choose the best internet plan for you...</p>
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

      <div className="container mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border border-gray-200">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">Find Your Perfect Package</h2>

          {error && (
            <div className="mb-6 p-3 text-red-700 bg-red-100 border border-red-300 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Service Provider</label>
              <select
                name="serviceProvider"
                value={formData.serviceProvider}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                {serviceProviders.length > 0 ? (
                  serviceProviders.map((provider) => (
                    <option key={provider} value={provider}>
                      {provider}
                    </option>
                  ))
                ) : (
                  <option value="">No providers available</option>
                )}
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
          </div>

          <button
            onClick={recommendPackage}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-lg"
          >
            Get Recommendation
          </button>
        </div>

        {recommendedPackage && (
          <div className="bg-yellow-50 rounded-3xl shadow-2xl p-8 mb-10 border-4 border-yellow-400">
            <h3 className="text-2xl font-bold text-yellow-600 mb-4">⭐ Recommended Package</h3>
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
          </div>
        )}

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
                  className={`overflow-hidden rounded-3xl shadow-lg transition-all bg-white ${
                    recommendedPackage?._id === pkg._id
                      ? "border-4 border-yellow-400 ring-2 ring-yellow-200"
                      : "border border-gray-200 hover:shadow-2xl hover:-translate-y-1"
                  }`}
                >
                  <div className="h-36 bg-gradient-to-br from-blue-500 via-sky-400 to-green-400 relative">
                    {pkg.coverImage ? (
                      <img
                        src={pkg.coverImage}
                        alt={pkg.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-end justify-between px-5 pb-4 text-white">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-white/80">Internet Package</p>
                          <h4 className="text-2xl font-bold leading-tight">{pkg.name}</h4>
                        </div>
                        <div className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur">
                          {pkg.serviceProvider}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-blue-600">{pkg.name}</h4>
                        <p className="text-sm text-gray-500">{pkg.serviceProvider}</p>
                      </div>
                      <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-600">
                        Rs {pkg.price}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-gray-500">Validation</p>
                        <p className="font-semibold">{pkg.validationTime} Days</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-gray-500">Call Minutes</p>
                        <p className="font-semibold">{pkg.callMinutes}</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-gray-500">Anytime Data</p>
                        <p className="font-semibold">{pkg.anytimeData} GB</p>
                      </div>
                      <div className="rounded-xl bg-gray-50 p-3">
                        <p className="text-gray-500">Night Data</p>
                        <p className="font-semibold">{pkg.nightTimeData} GB</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Social Media</p>
                      <p className="mt-1 text-sm text-gray-700">
                        {pkg.socialMedia && pkg.socialMedia.length > 0 ? pkg.socialMedia.join(", ") : "None"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No packages found for the selected provider.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserHome;
