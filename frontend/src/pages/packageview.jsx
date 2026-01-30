import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";
import Footer from "../components/Footer";

const PackageView = () => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const [package_data, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setPackageData(pkg);
      } else {
        setPackageData({
          _id: packageId,
          name: "Demo Package",
          price: 999,
          anytimeData: 10,
          nightTimeData: 5,
          callMinutes: 200,
          sms: 100,
          validationTime: 30,
          serviceProvider: "Demo Provider",
          socialMedia: ["WhatsApp", "Facebook"],
          coverImage: "",
        });
      }
    } catch (error) {
      setPackageData({
        _id: packageId,
        name: "Demo Package",
        price: 999,
        anytimeData: 10,
        nightTimeData: 5,
        callMinutes: 200,
        sms: 100,
        validationTime: 30,
        serviceProvider: "Demo Provider",
        socialMedia: ["WhatsApp", "Facebook"],
        coverImage: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async () => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/packages/${packageId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Package deleted successfully");
        navigate("/provider-dashboard");
      } catch (error) {
        alert("Failed to delete package");
      }
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
        <h1 className="text-2xl font-bold">Package Details</h1>
        <button
          onClick={() => navigate("/provider-dashboard")}
          className="bg-blue-500 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Back
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-blue-600 mb-8">{package_data?.name}</h2>

          {package_data?.coverImage && (
            <img
              src={package_data.coverImage}
              alt={package_data.name}
              className="w-full max-h-80 object-cover rounded-2xl mb-8 border border-gray-200"
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Package Name</p>
                <p className="text-2xl font-bold text-blue-600">{package_data?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Service Provider</p>
                <p className="text-xl font-semibold text-gray-800">{package_data?.serviceProvider}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Validation Period</p>
                <p className="text-xl font-semibold text-gray-800">{package_data?.validationTime} Days</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Price</p>
                <p className="text-3xl font-bold text-green-600">Rs {package_data?.price}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Anytime Data</p>
                <p className="text-2xl font-bold text-blue-600">{package_data?.anytimeData} GB</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Night Time Data</p>
                <p className="text-2xl font-bold text-blue-600">{package_data?.nightTimeData} GB</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Call Minutes</p>
                <p className="text-2xl font-bold text-blue-600">{package_data?.callMinutes}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">SMS</p>
                <p className="text-2xl font-bold text-blue-600">{package_data?.sms}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Social Media</p>
                <p className="text-lg font-semibold text-gray-800">
                  {package_data?.socialMedia?.length ? package_data.socialMedia.join(", ") : "None"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/edit-package/${packageId}`)}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg"
            >
              Edit Package
            </button>
            <button
              onClick={handleDeletePackage}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
            >
              Delete Package
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PackageView;
