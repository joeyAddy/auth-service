let express = require("express");
let {
  signUp,
  signin,
  getAllUser,
  restrictTo,
  protect,
} = require("./../controller/authController");

let router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signin);

// Protect all routes after this (Only-Admin) middleware
router.use(protect);
router.use(restrictTo("admin"));
router.route("/").get(getAllUser);

module.exports = router;
