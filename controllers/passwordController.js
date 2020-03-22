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
        const data = {
          id: password.id,
          account: password.account,
          email: password.email,
          password: password.password,
          UserId: password.UserId,
          msg: "Succesfuly input new password"
        };
        res.status(201).json(data);
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
        if (passwords.length) {
          res.status(200).json(passwords);
        } else {
          const err = {
            name: "dataNotFound"
          };
          next(err);
        }
      })
      .catch(next);
  }
  static readById(req, res, next) {
    const id = +req.params.id;
    Password.findByPk(id)
      .then(password => {
        if (password) {
          if (password.UserId === req.decode.id) {
            res.status(200).json(password);
          } else {
            const err = {
              name: "NotAuthorized",
              message: "You not have authorization"
            };
            next(err);
          }
        } else {
          const err = {
            name: "dataNotFound"
          };
          next(err);
        }
      })
      .catch(next);
  }
  static update(req, res, next) {
    const id = req.params.id;
    const updatePassword = {
      account: req.body.account,
      email: req.body.email,
      password: req.body.password,
      UserId: req.decode.id
    };
    Password.update(updatePassword, {
      where: {
        id
      }
    })
      .then(password => {
        if (password[0] === 0) {
          const err = {
            name: "dataNotFound"
          };
          next(err);
        } else res.status(200).json(password);
      })
      .catch(next);
  }
  static delete(req, res, next) {
    const id = +req.params.id;
    Password.findByPk(id)
      .then(password => {
        if (password) {
          if (password.UserId === req.decode.id) {
            return Password.destroy({
              where: {
                id
              }
            });
          } else {
            const err = {
              name: "NotAuthorized",
              message: "You not have authorization"
            };
            throw err;
          }
        } else {
          const err = {
            name: "dataNotFound"
          };
          throw err;
        }
      })
      .then(password => {
        if (password === 0) {
          const err = {
            name: "dataNotFound"
          };
          next(err);
        } else res.status(200).json(password);
      })
      .catch(next);
  }
}

module.exports = PasswordController;
