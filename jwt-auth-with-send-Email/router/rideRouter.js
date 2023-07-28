let express = require("express");
let {
  createRide,
  getRide,
  updateRide,
  deleteRide,
  getAllRides,
  getStudentMatch,
  getRiderMatch,
} = require("./../controller/rideController");
const { protect, restrictTo } = require("../controller/authController");

let router = express.Router();

router.post("/", createRide);
router.get("/", getRide);
router.get("/all", getAllRides);
router.get("/student/match", getStudentMatch);
router.get("/rider/match", getRiderMatch);
router.patch("/", updateRide);
router.delete("/", deleteRide);

// Protect all routes after this (Only-Admin) middleware
// router.use(protect);
// router.use(restrictTo("admin"));
// router.route("/").get(getAllUser);

module.exports = router;
