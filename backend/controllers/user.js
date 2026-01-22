const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'your_jwt_secret_key'; 


const admins = [
  { email: process.env.ADMIN_EMAIL_1, password: process.env.ADMIN_PASSWORD_1 },
  { email: process.env.ADMIN_EMAIL_2, password: process.env.ADMIN_PASSWORD_2 }
];


const createUser = async (req, res) => {
  const { username, email, password, role } = req.body; 

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || 'user' 
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
   
    const admin = admins.find(admin => admin.email === email);

    if (admin) {
      
      if (password === admin.password) {
        const token = jwt.sign(
          { email: admin.email, role: 'admin' },
          SECRET_KEY,
          { expiresIn: '1h' }
        );
        return res.status(200).json({
          message: "Login successful",
          token,
          user: { email: admin.email, role: 'admin' }
        });
      } else {
        return res.status(401).json({ message: "Invalid credentials." });
      }
    }

  
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

   
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { _id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const editUserProfile = async (req, res) => {
  const { username, email, password } = req.body;
  const userId = req.user.userId; 

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found." });

  
    if (username) user.username = username;
    if (email) user.email = email;

   
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
  const userId = req.user.userId; 

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found." });

    await user.remove();
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteUserByAdmin = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    await user.remove();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createUser,
  loginUser,
  editUserProfile,
  deleteUser,
  getAllUsers,
  deleteUserByAdmin
};



// const User = require('../models/userModel');
// const bcrypt = require('bcrypt'); 
// const jwt = require('jsonwebtoken');



// const createUser = async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
    
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ message: "Email already exists." });
//     }

    
//     const hashedPassword = await bcrypt.hash(password, 10); 

//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword
//     });

//     await newUser.save();
//     res.status(201).json({ message: "User created successfully!", user: newUser });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };





// // const loginUser = async (req, res) => {
// //   const { email, password } = req.body;
  
// //   if (!email || !password) {
// //     return res.status(400).json({ message: "Email and password are required." });
// //   }

// //   try {
// //     const user = await User.findOne({ email });
// //     if (!user) return res.status(404).json({ message: "User not found." });

  
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

// //     res.status(200).json({
// //       message: "Login successful",
// //       user: {
// //         _id: user._id,
// //         username: user.username,
// //         email: user.email
// //       }
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };





// const SECRET_KEY = 'your_jwt_secret_key'; // Keep your secret safe!

// // Hard-coded admin credentials
// const admins = [
//   { email: 'admin1@example.com', password: 'admin123' },
//   { email: 'admin2@example.com', password: 'admin456' },
// ];

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required." });
//   }

//   try {
//     // Check if user is in the list of hard-coded admins
//     const admin = admins.find(admin => admin.email === email);
    
//     if (admin) {
//       // If found in the admin list, compare the password
//       if (password === admin.password) {
//         const token = jwt.sign(
//           { email: admin.email, role: 'admin' }, // Role set as 'admin'
//           SECRET_KEY,
//           { expiresIn: '1h' }
//         );
//         return res.status(200).json({
//           message: "Login successful",
//           token, // Send the token to the frontend
//           user: {
//             email: admin.email,
//             role: 'admin', // Admin role
//           },
//         });
//       } else {
//         return res.status(401).json({ message: "Invalid credentials." });
//       }
//     }

//     // If the email is not in the hard-coded admins, check in the database for a normal user
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found." });

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

//     // Generate JWT token for normal user
//     const token = jwt.sign(
//       { userId: user._id, role: 'user' }, // Role set as 'user'
//       SECRET_KEY,
//       { expiresIn: '1h' }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token, // Send the token to the frontend
//       user: {
//         _id: user._id,
//         username: user.username,
//         email: user.email
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// module.exports = { createUser, loginUser };


