const router = require("express").Router();
const userRouter = require("./userRouter");
const passwordRouter = require("./passwordRouter");
const { auth } = require("../middlewares/authentification");
const errorHandler = require("../middlewares/errorHandler");

router.use("/auth", userRouter);
router.use(auth);
router.use("/passwords", passwordRouter);
router.use(errorHandler);

module.exports = router;
