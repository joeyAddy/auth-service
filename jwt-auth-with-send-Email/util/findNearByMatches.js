// Assume you have Rider and Ride models defined in your application
const Ride = require("../model/rideModel");
const CarRider = require("../model/riderModel");

// Function to calculate the distance between two geographic points using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

// Function to find nearby matches within 30 kilometers from the given origin
async function findNearbyMatches(originLat, originLng) {
  const nearbyRiders = [];
  const nearbyRides = [];

  try {
    // Retrieve all riders from the database
    const riders = await CarRider.find().populate("user");

    // Retrieve all rides from the database
    const rides = await Ride.find({ status: "available" }).populate("user");

    // Loop through each rider and calculate the distance from their origin to the given origin
    riders.forEach((rider) => {
      const distanceToRiderOrigin = calculateDistance(
        originLat,
        originLng,
        rider.location.latitude, // Latitude of rider's origin
        rider.location.longitude // Longitude of rider's origin
      );

      // Loop through each ride and calculate the distance from the given origin to the ride's origin
      rides.forEach((ride) => {
        const distanceToRideOrigin = calculateDistance(
          originLat,
          originLng,
          ride.origin.latitude, // Latitude of ride's origin
          ride.origin.longitude // Longitude of ride's origin
        );

        // Check if both distances are within 30 kilometers and add them to the array of nearbyMatches
        if (distanceToRiderOrigin <= 30 && distanceToRideOrigin <= 30) {
          nearbyRiders.push({
            rider: rider,
            distanceToRider: distanceToRiderOrigin,
          });
          nearbyRides.push({
            ride: ride,
            distanceToRideOrigin: distanceToRideOrigin,
          });
        }
      });
    });

    // console.log(nearbyRides);
    // console.log(nearbyRiders);

    return { nearbyRiders, nearbyRides };
  } catch (error) {
    console.log(error, "error");
  }
}

module.exports = {
  findNearbyMatches,
};
