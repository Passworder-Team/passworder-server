const router = require("express").Router();
const OtpController = require("../controllers/otpController");

router.get("/", OtpController.generateOtp);
router.post("/", OtpController.compareOtp);

module.exports = router;
