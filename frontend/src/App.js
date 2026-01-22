import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login';
import Signup from './pages/signup';
import AdminHome from './pages/adminhome';  // Import Admin Home page
// import UserHome from './pages/UserHome';    // Import User Home page

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route (Signup) */}
        <Route path="/" element={<Signup />} />
        
        {/* Signup Route */}
        <Route path="/signup" element={<Signup />} />
        
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Home Page (accessible only for admin) */}
        <Route path="/admin-home" element={<AdminHome />} />

        {/* User Home Page (accessible only for normal users) */}
        {/* <Route path="/user-home" element={<UserHome />} /> */}
      </Routes>
    </Router>
  );
}

export default App;



// import './App.css';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from './pages/login';
// import Signup from './pages/signup';

// function App() {
//   return (
//      <Router>
//       <Routes>
//         <Route path="/" element={<Signup />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
