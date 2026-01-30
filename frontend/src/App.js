import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/login';
import Signup from './pages/signup';
import UserHome from './pages/userhome';
import UserProfile from './pages/userprofile';
import ProviderDashboard from './pages/providerdashboard';
import AddPackage from './pages/addpackage';
import EditPackage from './pages/editpackage';
import PackageView from './pages/packageview';
import ProviderProfile from './pages/users';
import GuestRecommendation from './pages/guest';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default and auth routes */}
        <Route path="/" element={<GuestRecommendation />} />
        <Route path="/guest" element={<GuestRecommendation />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Normal User Routes */}
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/user-profile" element={<UserProfile />} />

        {/* Service Provider Routes */}
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
        <Route path="/add-package" element={<AddPackage />} />
        <Route path="/edit-package/:packageId" element={<EditPackage />} />
        <Route path="/package-view/:packageId" element={<PackageView />} />
        <Route path="/provider-profile" element={<ProviderProfile />} />
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
