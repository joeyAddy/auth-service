const mongoose = require("mongoose");
const uniqid = require("uniqid");

// Define the CarRider Schema
const carRiderSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  plateNumber: {
    type: String,
    required: [true, "please provide your plate Number"],
    unique: true,
  },
  vehicleCode: {
    type: String,
    required: true,
    unique: true,
    default: () => uniqid(), // Generate a random code using
  },
  rating: {
    type: Number,
    default: 0,
  },
  location: {
    type: Object,
    required: [
      true,
      "please provide turn on your location and turn on location access for this app in settings",
    ],
  },
  ridesCompleted: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Mongoose pre-save middleware
carRiderSchema.pre("save", async function (next) {
  // If vehicleCode is not provided or is empty, generate a new one
  if (!this.vehicleCode || this.vehicleCode.trim() === "") {
    let generatedCode = uniqid();
    while (true) {
      // Check if the generatedCode already exists in the database
      const existingCarRider = await this.constructor.findOne({
        vehicleCode: generatedCode,
      });
      if (!existingCarRider) {
        this.vehicleCode = generatedCode;
        break;
      }
      // Regenerate a new code if the generatedCode already exists
      generatedCode = uniqid();
    }
  }
  next();
});

// Create the CarRider model using the schema
const CarRider = mongoose.model("CarRider", carRiderSchema);

module.exports = CarRider;
