import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Use this for navigation

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // To navigate the user after successful signup

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
      const response = await axios.post("http://localhost:4000/api/createuser", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        setSuccess("User created successfully! Please login.");
        alert("User created successfully! Please login.");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Redirect the user to the login page
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-green-100 to-green-200">
      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">Welcome!</h1>
        <p className="text-center text-green-700 mb-8 font-medium">
          Choose the best and cost-effective mobile package for you...
        </p>

        {error && (
          <div className="mb-6 p-3 text-red-700 bg-red-100 border border-red-300 rounded-lg text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
  );
}



// import { useState } from "react";
// import axios from "axios";

// export default function Signup() {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
//       setError("All fields are required.");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setError("");
//     setSuccess("");

//     try {
//       const response = await axios.post("http://localhost:4000/api/createuser", {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password,
//       });

//       if (response.status === 201) {
//         setSuccess("User created successfully! Please login.");
//         alert("User created successfully! Please login.");
//         setFormData({
//           username: "",
//           email: "",
//           password: "",
//           confirmPassword: "",
//         });
//       }
//     } catch (err) {
//       if (err.response) {
      
//         setError(err.response.data.message || "Something went wrong!");
//       } else {
     
//         setError("Failed to connect to server.");
//       }
//     }
//   };

//   return (
    
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-green-100 to-green-200">
//   <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-gray-200">
//     <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
//       Welcome!
//     </h1>
//     <p className="text-center text-green-700 mb-8 font-medium">
//       Choose the best and cost-effective mobile package for you...
//     </p>

//     {error && (
//       <div className="mb-6 p-3 text-red-700 bg-red-100 border border-red-300 rounded-lg text-center font-medium animate-pulse">
//         {error}
//       </div>
//     )}

//     <form onSubmit={handleSubmit} className="space-y-5">
//       <input
//         type="text"
//         name="username"
//         placeholder="User Name"
//         value={formData.username}
//         onChange={handleChange}
//         className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition shadow-sm hover:shadow-md"
//       />

//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         value={formData.email}
//         onChange={handleChange}
//         className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition shadow-sm hover:shadow-md"
//       />

//       <input
//         type="password"
//         name="password"
//         placeholder="Password"
//         value={formData.password}
//         onChange={handleChange}
//         className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition shadow-sm hover:shadow-md"
//       />

//       <input
//         type="password"
//         name="confirmPassword"
//         placeholder="Confirm Password"
//         value={formData.confirmPassword}
//         onChange={handleChange}
//         className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition shadow-sm hover:shadow-md"
//       />

//       <button
//         type="submit"
//         className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
//       >
//         Signup
//       </button>
//     </form>

//     <p className="mt-6 text-center text-gray-500 text-sm">
//       Already have an account?{" "}
//       <a href="/login" className="text-blue-600 font-medium hover:underline">
//         Login
//       </a>
//     </p>
//   </div>
// </div>

//   );
// }
