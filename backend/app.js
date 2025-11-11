
const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router');



app.use(cors());
app.use(express.json({limit: '30mb'}));
app.use(express.urlencoded({limit: '30mb', extended: true }));



app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/api', router); 

module.exports = app;

