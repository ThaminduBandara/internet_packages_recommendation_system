import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../config/api";

const AdminHome = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServiceProviders();
    fetchAllPackages();
  }, []);

  const fetchServiceProviders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/service-providers`);
      if (response.data.length > 0) {
        setServiceProviders(response.data.map(provider => ({ name: provider, image: "https://via.placeholder.com/150" })));
      } else {
        setServiceProviders([
          { name: "Mobitel", image: "https://via.placeholder.com/150" },
          { name: "Hutch", image: "https://via.placeholder.com/150" },
          { name: "Dialog", image: "https://via.placeholder.com/150" },
        ]);
      }
    } catch (error) {
      console.log("Could not fetch service providers - using defaults");
      setServiceProviders([
        { name: "Mobitel", image: "https://via.placeholder.com/150" },
        { name: "Hutch", image: "https://via.placeholder.com/150" },
        { name: "Dialog", image: "https://via.placeholder.com/150" },
      ]);
    }
  };

  const fetchAllPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/packages`);
      const packagesMap = {};
      response.data.forEach(pkg => {
        if (!packagesMap[pkg.serviceProvider]) {
          packagesMap[pkg.serviceProvider] = [];
        }
        packagesMap[pkg.serviceProvider].push(pkg);
      });
      setPackages(packagesMap);
    } catch (error) {
      console.log("Could not fetch packages");
    } finally {
      setLoading(false);
    }
  };

 
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

 
  const handleAddPackage = () => {
    navigate("/add-package");
  };

  return (
    <div className="admin-home">
     
      <nav className="flex items-center justify-between bg-blue-500 p-4 text-white">
        <div className="flex items-center space-x-3">
          <img src="https://via.placeholder.com/50" alt="Logo" className="rounded-full" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex space-x-4">
          <button
            className="bg-green-500 px-4 py-2 rounded-lg font-semibold hover:bg-green-600"
            onClick={() => navigate("/users")}
          >
            Users
          </button>
          <button
            className="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

     
      <div className="flex justify-center mt-5">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold text-lg hover:bg-blue-600 transition-all shadow-lg"
          onClick={handleAddPackage}
        >
          Add Package
        </button>
      </div>

      <div className="container mx-auto mt-10 px-4">
        {loading ? (
          <p>Loading packages...</p>
        ) : (
          serviceProviders.map((provider) => (
            <div key={provider.name} className="my-8">
              <h2 className="text-xl font-bold text-blue-700 mb-5">{provider.name}</h2>
              <div className="grid grid-cols-3 gap-6">
                {packages[provider.name]?.map((pkg) => (
                  <div key={pkg._id} className="package-card border rounded-lg p-5 shadow-lg">
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{pkg.name}</h3>
                      <p>Anytime Data: {pkg.anytimeData} GB</p>
                      <p>Night Data: {pkg.nightData} GB</p>
                      <p>Call Minutes: {pkg.callMinutes}</p>
                      <p>SMS: {pkg.sms}</p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                        onClick={() => navigate(`/edit-package/${pkg._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        onClick={() => handleDeletePackage(pkg._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

 
  const handleDeletePackage = (packageId) => {
    const confirmation = window.confirm("Are you sure you want to delete this package?");
    if (confirmation) {
      // Call API to delete package
      // For now, just log the packageId
      console.log("Deleted Package ID:", packageId);
    }
  };
};

export default AdminHome;
