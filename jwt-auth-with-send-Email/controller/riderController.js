const User = require("../model/userModel");
const catchAsync = require("../util/catchAsync");
const CarRider = require("./../model/riderModel"); // Path to the CarRider model
const AppError = require("./../util/appError");
const sendEmail = require("./../util/email");
const { default: mongoose } = require("mongoose");

// Central function to handle responses
const handleResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: "success",
    data,
  });
};

// Function for creating a rider
exports.createRider = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.user });
    const rider = await CarRider.find({ user: req.body.user });
    if (rider.length > 0) {
      return next(new AppError("User already has a rider", 400));
    }

    if (user) {
      const newRider = await CarRider.create({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.user,
        plateNumber: req.body.plateNumber,
        vehicleCode: req.body?.vehicleCode,
        location: req.body.location,
      });
      handleResponse(res, 201, newRider);
    } else {
      next(new AppError("User with rider ID not found", 404));
    }
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

// Function for retrieving a rider
exports.getRider = catchAsync(async (req, res, next) => {
  try {
    const queryParam = req.query.email;
    const rider = await CarRider.find()
      .populate({
        path: "user",
        match: { $or: [{ email: { $regex: new RegExp(queryParam, "i") } }] },
        select: "name phone", // Select the 'name' field of the User model in the results
      })
      .exec();

    if (!rider) {
      return next(new AppError(`Rider does not have a profile`, 404));
    }
    handleResponse(res, 200, rider);
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});

// Function for updating a rider
exports.updateRider = catchAsync(async (req, res, next) => {
  try {
    const updatedRider = await CarRider.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedRider) {
      return next(new AppError("Rider not found", 404));
    }
    handleResponse(res, 200, updatedRider);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

// Function for deleting a rider
exports.deleteRider = catchAsync(async (req, res, next) => {
  try {
    const deletedRider = await CarRider.findByIdAndDelete(req.params.id);
    if (!deletedRider) {
      return next(new AppError("Rider not found", 404));
    }
    handleResponse(res, 204, null); // 204 No Content status for successful deletion
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});
