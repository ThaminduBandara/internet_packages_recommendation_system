const express = require('express');
const router = express.Router();


const { createUser, loginUser, editUserProfile, deleteUser, getAllUsers, deleteUserByAdmin } = require('./controllers/user');
const { authenticateToken, checkAdminRole } = require('./middleware/auth');
const { createPackage, getAllPackages, getPackagesByServiceProvider, updatePackage, deletePackage } = require('./controllers/package');

//User routes
router.post('/createuser', createUser);   // Create a new user (signup)
router.post('/login', loginUser);         // User login (normal user or admin)
router.put('/profile', authenticateToken, editUserProfile);  // Edit own profile (normal users)
router.delete('/delete', authenticateToken, deleteUser);    // Delete own account (normal users)
router.get('/users', authenticateToken, checkAdminRole, getAllUsers);       // Get all users (admin only)
router.delete('/users/:userId', authenticateToken, checkAdminRole, deleteUserByAdmin);  // Delete any user (admin only)


// Package routes
router.post('/packages', authenticateToken, createPackage);  // Create a new package (provider-only)
router.get('/packages', getAllPackages);  // Get all packages (public access for guests)
router.get('/packages/:serviceProvider', getPackagesByServiceProvider);  // Get packages by service provider (public access for guests)
router.put('/packages/:packageId', authenticateToken, updatePackage);  // Update a package (provider)
router.delete('/packages/:packageId', authenticateToken, deletePackage);  // Delete a package (provider)






module.exports = router;



// const express = require('express');
// const router = express.Router();
// const { createUser, loginUser} = require('./controllers/user');






// router.post('/createuser', createUser);
// router.post('/login', loginUser);


// module.exports = router;