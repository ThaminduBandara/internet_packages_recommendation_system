
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

  username: { 
    type: String, 
    required: true, 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address'] // Regex to validate email format
  },
  password: { 
    type: String, 
    required: true,
  },
  role: { 
    type: String, 
    default: 'user', 
    enum: ['user', 'provider', 'admin'], 
  },
}, { timestamps: true }); 


const User = mongoose.model('User', userSchema);

module.exports = User;

