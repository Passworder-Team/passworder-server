const { User, Password } = require("../models");
const jwt = require('jsonwebtoken')
const getRandomSecret = require('../helpers/getRandomSecret')

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
          data: {
            id: password.id,
            account: password.account,
            email: password.email,
            UserId: password.UserId,
          },
          msg: "Succesfully input new password"
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
          const newPasswords = passwords.map(password => {
            return {
              id: password.id,
              account: password.account,
              email: password.email,
              UserId: password.UserId,
            }
          })
          res.status(200).json(newPasswords);
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
          const { id, account, email, UserId } = password
          const randomSecret = getRandomSecret()
          const encryptedPassword = jwt.sign(password.password, randomSecret);
          console.log('Encrypted Pass:',encryptedPassword);
          console.log('Random secret', randomSecret);
          res.status(200).json({
            id,
            account,
            email,
            UserId
          })
        } else {
          next({
            name: "dataNotFound"
          });
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
