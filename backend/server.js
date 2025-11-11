const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config(); 

const port = process.env.PORT || 4000;
const host = process.env.HOST || 'localhost';
const uri = process.env.MONGO_URI;

const connect = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB - package recommendation system');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
};

connect();

const server = app.listen(port, host, () => {
    console.log(`Node server is listening on ${server.address().port}`);
});
