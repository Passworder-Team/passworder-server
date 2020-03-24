const router = require("express").Router();
const PasswordController = require("../controllers/passwordController");
const { check } = require("../middlewares/authorization");

router.post("/", PasswordController.addPassword);
router.get("/", PasswordController.readAll);
router.use(check);
router.get("/link/:account", PasswordController.readByLink);
router.get("/:id", PasswordController.readById);
router.put("/:id", PasswordController.update);
router.delete("/:id", PasswordController.delete);

module.exports = router;
