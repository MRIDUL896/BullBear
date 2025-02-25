const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please provide a valid email address",
    ],
  },
  password: {
    type: String,
  },
  uid : {
    type: String,
    required : true
  },
  interestedStocks: {
    type: [String],
    default: [],
  }
},{
    timestamps : true
});

// Middleware to remove duplicates before saving
userSchema.pre("save", function (next) {
  this.interestedStocks = [...new Set(this.interestedStocks)];
  next();
});


module.exports = mongoose.model("Users", userSchema);