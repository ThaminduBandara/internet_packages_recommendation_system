const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router');  // Import routes from your 'router.js' file

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json({ limit: '30mb' })); // Handle JSON payloads with limit
app.use(express.urlencoded({ limit: '30mb', extended: true })); // Handle URL-encoded data

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Use the imported router for API routes
app.use('/api', router); // All routes starting with '/api' will use the router

module.exports = app;


// const express = require('express');
// const app = express();
// const cors = require('cors');
// const router = require('./router');



// app.use(cors());
// app.use(express.json({limit: '30mb'}));
// app.use(express.urlencoded({limit: '30mb', extended: true }));



// app.get('/', (req, res) => {
//   res.json({ message: 'API is running' });
// });

// app.use('/api', router); 

// module.exports = app;

