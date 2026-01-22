const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();  // Load environment variables from .env file

const port = process.env.PORT || 4000; // Port to listen on, default is 4000
const host = process.env.HOST || 'localhost'; // Host to bind to, default is 'localhost'
const uri = process.env.MONGO_URI; // MongoDB URI from environment variables

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB - package recommendation system');
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
  }
};

// Establish MongoDB connection
connect();

// Start the server
const server = app.listen(port, host, () => {
  console.log(`Node server is listening on ${server.address().port}`);
});


// const mongoose = require('mongoose');
// const app = require('./app');
// require('dotenv').config(); 

// const port = process.env.PORT || 4000;
// const host = process.env.HOST || 'localhost';
// const uri = process.env.MONGO_URI;

// const connect = async () => {
//     try {
//         await mongoose.connect(uri);
//         console.log('Connected to MongoDB - package recommendation system');
//     } catch (error) {
//         console.log('Error connecting to MongoDB:', error);
//     }
// };

// connect();

// const server = app.listen(port, host, () => {
//     console.log(`Node server is listening on ${server.address().port}`);
// });
