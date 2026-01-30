import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import Footer from "../components/Footer";

const EditPackage = () => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    validationTime: "",
    price: "",
    anytimeData: "",
    nightTimeData: "",
    callMinutes: "",
    sms: "",
    socialMedia: [],
    coverImage: "",
  });

  const socialMediaOptions = ["WhatsApp", "Facebook", "Instagram", "YouTube", "TikTok", "Twitter"];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchPackageData();
    }
  }, [token, packageId, navigate]);

  const fetchPackageData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/packages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pkg = response.data.find((p) => p._id === packageId);
      if (pkg) {
        setFormData({
          name: pkg.name,
          validationTime: pkg.validationTime,
          price: pkg.price,
          anytimeData: pkg.anytimeData,
          nightTimeData: pkg.nightTimeData,
          callMinutes: pkg.callMinutes,
          sms: pkg.sms,
          socialMedia: pkg.socialMedia || [],
          coverImage: pkg.coverImage || "",
        });
      }
    } catch (error) {
      setError("Failed to load package data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSocialMediaChange = (platform) => {
    const currentSocialMedia = formData.socialMedia || [];
    if (currentSocialMedia.includes(platform)) {
      setFormData({
        ...formData,
        socialMedia: currentSocialMedia.filter((item) => item !== platform),
      });
    } else {
      setFormData({
        ...formData,
        socialMedia: [...currentSocialMedia, platform],
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFormData({ ...formData, coverImage: "" });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, coverImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.validationTime ||
      !formData.price ||
      !formData.anytimeData ||
      !formData.nightTimeData ||
      !formData.callMinutes ||
      !formData.sms
    ) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/packages/${packageId}`,
        {
          name: formData.name,
          validationTime: parseInt(formData.validationTime),
          price: parseInt(formData.price),
          anytimeData: parseInt(formData.anytimeData),
          nightTimeData: parseInt(formData.nightTimeData),
          callMinutes: parseInt(formData.callMinutes),
          sms: parseInt(formData.sms),
          socialMedia: formData.socialMedia,
          coverImage: formData.coverImage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setSuccess("Package updated successfully!");
        alert("Package updated successfully!");
        navigate("/provider-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update package");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-200 via-green-100 to-green-200 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-200 via-green-100 to-green-200">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-blue-600 p-4 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Edit Package</h1>
        <button
          onClick={() => navigate("/provider-dashboard")}
          className="bg-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Back
        </button>
      </nav>

      {/* Form Container */}
      <div className="flex-1 container mx-auto px-4 py-10">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Package Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Service Provider</label>
              <input
                type="text"
                value="Auto-detected from your account"
                disabled
                className="w-full px-5 py-3 border border-gray-300 rounded-xl bg-gray-100 text-gray-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Validation Time (Days)</label>
                <input
                  type="number"
                  name="validationTime"
                  value={formData.validationTime}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price (Rs)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Anytime Data (GB)</label>
                <input
                  type="number"
                  name="anytimeData"
                  value={formData.anytimeData}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Night Time Data (GB)</label>
                <input
                  type="number"
                  name="nightTimeData"
                  value={formData.nightTimeData}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Call Minutes</label>
                <input
                  type="number"
                  name="callMinutes"
                  value={formData.callMinutes}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">SMS</label>
                <input
                  type="number"
                  name="sms"
                  value={formData.sms}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3">Available Social Media Platforms</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {socialMediaOptions.map((platform) => (
                  <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.socialMedia.includes(platform)}
                      onChange={() => handleSocialMediaChange(platform)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-gray-700">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-3">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              {formData.coverImage && (
                <div className="mt-4">
                  <img
                    src={formData.coverImage}
                    alt="Package cover preview"
                    className="w-full max-h-56 object-cover rounded-xl border border-gray-200"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-lg"
            >
              Update Package
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditPackage;
