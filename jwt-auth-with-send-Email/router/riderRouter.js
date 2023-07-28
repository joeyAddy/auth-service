let express = require("express");
let {
  createRider,
  getRider,
  updateRider,
  deleteRider,
} = require("./../controller/riderController");
const { restrictTo, protect } = require("../controller/authController");

let router = express.Router();

router.post("/", createRider);
router.get("/", getRider);
router.patch("/", updateRider);
router.delete("/", deleteRider);

// Protect all routes after this (Only-Admin) middleware
// router.use(protect);
// router.use(restrictTo("admin"));
// router.route("/").get(getAllUser);

module.exports = router;
