const { default: mongoose } = require("mongoose");
const Ride = require("../model/rideModel");
const catchAsync = require("../util/catchAsync");
const AppError = require("./../util/appError");
const sendEmail = require("./../util/email");
const CarRider = require("../model/riderModel");
const findMatch = require("../util/findMatch");
const User = require("../model/userModel");
const { findNearbyMatches } = require("../util/findNearByMatches");

// Central function to handle responses
const handleResponse = (res, statusCode, data, status) => {
  res.status(statusCode).json({
    status: `${status}`,
    data,
  });
};

// Function for creating a ride
exports.createRide = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.user });

    if (user) {
      const newRide = await Ride.create({
        _id: new mongoose.Types.ObjectId(),
        rideType: req.body.rideType,
        user: req.body.user,
        origin: req.body.origin,
        destination: req.body.destination,
        paymentMethod: req.body.paymentMethod,
        paymentStatus: req.body.paymentStatus,
        from: req.body.from,
        amount: req.body.amount,
        to: req.body.to,
        coordinates: req.body.coordinates,
        rideInfo: req.body.rideInfo,
      });
      handleResponse(res, 201, newRide, "sucess");
    } else {
      next(new AppError("User with rider ID not found", 404));
    }
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

// Function for retrieving a ride
exports.getRide = catchAsync(async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.query.id)
      .populate("user", "name phone") // Populate the user field with username and email
      .populate({
        path: "rider",
        populate: {
          path: "user",
          select: "name phone", // You can specify the fields to include from the userSchema
        },
      }); // Populate the rider field;
    if (!ride) {
      return next(new AppError("Ride not found", 404));
    }
    handleResponse(res, 200, ride, "success");
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});

// Function for retrieving all rides
exports.getAllRides = catchAsync(async (req, res, next) => {
  try {
    const ride = await Ride.find()
      .populate("user", "name phone") // Populate the user field with username and email
      .populate({
        path: "rider",
        populate: {
          path: "user",
          select: "name phone", // You can specify the fields to include from the userSchema
        },
      }); // Populate the rider field;
    if (ride.length < 1) {
      return next(new AppError("No Rides not found", 404));
    }
    handleResponse(res, 200, ride, "success");
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});

// Function for retrieving all rides
exports.getRiderMatch = catchAsync(async (req, res, next) => {
  try {
    const queryParam = req.query.id;

    const rider = await CarRider.findById(queryParam);

    if (rider !== null) {
      const { nearbyRides } = await findNearbyMatches(
        rider.location.latitude,
        rider.location.longitude
      );
      if (nearbyRides == undefined) {
        return next(new AppError("No Rides not found", 404));
      }
      handleResponse(res, 200, nearbyRides, "success");
    } else {
      return next(
        new AppError(
          "No Available rides at the moment please keep driving while we are searching",
          404
        )
      );
    }
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});

exports.getStudentMatch = catchAsync(async (req, res, next) => {
  try {
    const queryParam = req.query.id;

    const ride = await Ride.findOne({ user: queryParam });

    if (ride) {
      const { nearbyRiders } = await findNearbyMatches(
        ride.origin.latitude,
        ride.origin.longitude
      );
      if (nearbyRiders == undefined) {
        return next(new AppError("No Rides not found", 404));
      }

      handleResponse(res, 200, nearbyRiders, "success");
    } else {
      return next(
        new AppError(
          "No Available rides at the moment please keep driving while we are searching",
          404
        )
      );
    }
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});

// Function for updating a ride
exports.updateRide = catchAsync(async (req, res, next) => {
  try {
    const updatedRide = await Ride.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedRide) {
      return next(new AppError("Ride not found", 404));
    }
    handleResponse(res, 200, updatedRide, "success");
  } catch (error) {
    next(new AppError(error.message, 400));
  }
});

// Function for deleting a ride
exports.deleteRide = catchAsync(async (req, res, next) => {
  try {
    const deletedRide = await Ride.findByIdAndDelete(req.params.id);
    if (!deletedRide) {
      return next(new AppError("Ride not found", 404));
    }
    handleResponse(res, 204, null, "error"); // 204 No Content status for successful deletion
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});
