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
  static readAll(req, res, next) {
    const UserId = req.decode.id;
    Password.findAll({
      where: {
        UserId
      }
    })
      .then(passwords => {
        res.status(200).json(passwords);
      })
      .catch(next);
  }
  static readById(req, res, next) {
    const id = +req.params.id;
    Password.findByPK(id)
      .then(password => {
        res.status(200).json(password);
      })
      .catch(next);
  }
  static delete(req, res, next) {
    const id = +req.params.id;
    Password.destroy({
      where: {
        id
      }
    })
      .then(password => {
        res.status(200).json(password);
      })
      .catch(next);
  }
}

module.exports = PasswordController;
