const router = require("express").Router();
const PasswordController = require("../controllers/passwordController");

router.post("/", PasswordController.addPassword);
router.get("/", PasswordController.readAll);
router.get("/:id", PasswordController.readById);
router.delete(":id", PasswordController.delete);

module.exports = router;
