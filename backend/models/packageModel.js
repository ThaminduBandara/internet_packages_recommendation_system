const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema(
  {
    name: {
      type: String,
      required: true, 
    },
    validationTime: {
      type: Number,
      required: true,  
    },
    price: {
      type: Number,
      required: true, 
    },
    anytimeData: {
      type: Number,
      required: true,  
    },
    nightTimeData: {
      type: Number,
      required: true, 
    },
    callMinutes: {
      type: Number,
      required: true,  
    },
    sms: {
      type: Number,
      required: true,  
    },
    serviceProvider: {
      type: String,
      required: true, 
    },
    socialMedia: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }  
);


const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
