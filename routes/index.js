const router = require("express").Router();
const userRouter = require("./userRouter");
const passwordRouter = require("./passwordRouter");
const otpRouter = require("./otpController");
const { auth } = require("../middlewares/authentification");
const errorHandler = require("../middlewares/errorHandler");

router.use("/auth", userRouter);
router.use(auth);
router.use("/passwords", passwordRouter);
router.use("/otp", otpRouter);
router.use(errorHandler);

module.exports = router;
