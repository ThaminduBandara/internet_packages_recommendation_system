
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
  
    
    name : String,


});

const Package = mongoose.model('Package', packageSchema); 

module.exports = Package;