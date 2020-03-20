const { User, Password } = require("../models");

class PasswordController {
  static addPassword(req, res, next) {
    const newPassword = {
      account: req.body.account,
      email: req.body.email,
      password: req.body.password,
      UserId: req.decode.id
    };
    Password.create(newPassword)
      .then(password => {
        res.status(201), json(password);
      })
      .catch(next);
  }
}
