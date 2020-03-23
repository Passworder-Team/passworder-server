const router = require("express").Router();
const OtpController = require("../controllers/otpController");

router.get("/:passId", OtpController.getOtp);
router.post("/", OtpController.compareOtp);

module.exports = router;
