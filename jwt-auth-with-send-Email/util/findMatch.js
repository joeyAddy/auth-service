const Ride = require("../model/rideModel");
const User = require("./../model/userModel");
const calculateHaversineDistance = require("./calculateDistance");

// Custom function to find a match based on origin, destination, and within a certain radius
const findMatch = async (origin, maxDistance) => {
  try {
    const availableRiders = await User.find({ role: "rider" });
    const availableRides = await Ride.find({ status: "available" }).populate(
      "user",
      "name phone"
    );

    let closestDistance = Infinity;
    let matchedRider = null;
    let matchedRides = null;

    availableRiders.forEach((rider) => {
      const distanceToRider = calculateHaversineDistance(
        origin.latitude,
        origin.longitude,
        rider?.origin?.latitude,
        rider?.origin?.longitude
      );

      availableRides.forEach((ride) => {
        const distanceToTraveler = calculateHaversineDistance(
          origin.latitude,
          origin.longitude,
          ride?.origin?.latitude,
          ride?.origin?.longitude
        );

        const totalDistance = distanceToRider + distanceToTraveler;

        if (totalDistance < closestDistance && totalDistance <= maxDistance) {
          closestDistance = totalDistance;
          matchedRider = rider;
          matchedRides = ride;
        }
      });
    });

    if (matchedRider && matchedRides) {
      // Found a match, notify both parties
      return { rider: matchedRider, rides: matchedRides };
    } else {
      // No match found
      return null;
    }
  } catch (err) {
    console.error("Error while finding matches:", err);
    return null;
  }
};
module.exports = findMatch;
