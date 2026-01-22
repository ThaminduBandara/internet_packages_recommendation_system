import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Use this for navigation

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // To navigate after successful login

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        setSuccess("Login successful!");

        // Store the JWT token
        localStorage.setItem("token", response.data.token);

        // Get the role of the user (admin or user)
        const role = response.data.user.role;

        // Show an alert to indicate whether the user is an admin or a normal user
        if (role === "admin") {
          alert("You are logged in as an Admin");
          // Optionally, you can navigate to the admin page (remove alert if needed)
          navigate("/admin-home");
        } else {
          alert("You are logged in as a Normal User");
          // Optionally, you can navigate to the user home page (remove alert if needed)
          // navigate("/user-home");
        }

        // Reset form data
        setFormData({
          email: "",
          password: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to connect to server");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-green-100 to-green-200">
      <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">Welcome Back!</h1>
        <p className="text-center text-green-700 mb-8 font-medium">
          Sign in to choose the best and cost-effective mobile package
        </p>

        {error && (
          <div className="mb-6 p-3 text-red-700 bg-red-100 border border-red-300 rounded-lg text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 text-green-700 bg-green-100 border border-green-300 rounded-lg text-center font-medium animate-pulse">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 font-medium hover:underline">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}



// import { useState } from "react";
// import axios from "axios";

// export default function Login() {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       setError("Please enter both email and password.");
//       return;
//     }

//     setError("");
//     setSuccess("");

//     try {
//       const response = await axios.post("http://localhost:4000/api/login", {
//         email: formData.email,
//         password: formData.password,
//       });

//       if (response.status === 200) {
//         setSuccess("Login successful!");
       
//         localStorage.setItem("user", JSON.stringify(response.data));

        
//         setFormData({
//           email: "",
//           password: "",
//         });

  
//       } else {
//         setError(response.data.message || "Login failed");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to connect to server");
//     }
//   };

//   return (

//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-green-100 to-green-200">
//   <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-gray-200">
//     <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
//       Welcome Back!
//     </h1>
//     <p className="text-center text-green-700 mb-8 font-medium">
//       Signin to choose the best and cost-effective mobile package
//     </p>

//     {error && (
//       <div className="mb-6 p-3 text-red-700 bg-red-100 border border-red-300 rounded-lg text-center font-medium animate-pulse">
//         {error}
//       </div>
//     )}

//     {success && (
//       <div className="mb-6 p-3 text-green-700 bg-green-100 border border-green-300 rounded-lg text-center font-medium animate-pulse">
//         {success}
//       </div>
//     )}

//     <form onSubmit={handleSubmit} className="space-y-5">
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

//       <button
//         type="submit"
//         className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
//       >
//         Login
//       </button>
//     </form>

//     <p className="mt-6 text-center text-gray-500 text-sm">
//       Don't have an account?{" "}
//       <a href="/signup" className="text-blue-600 font-medium hover:underline">
//         Signup
//       </a>
//     </p>
//   </div>
// </div>

//   );
// }
