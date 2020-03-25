const { Password } = require("../models");
const jwt = require("jsonwebtoken");
const getRandomSecret = require("../helpers/getRandomSecret");
const Redis = require("ioredis");
const redis = new Redis();

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
            password: password.password
          },
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
          const newPasswords = passwords.map(password => {
            return {
              id: password.id,
              account: password.account,
              email: password.email,
              UserId: password.UserId
            };
          });
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
  static readByLink(req, res, next) {
    const link = req.params.account;
    Password.findOne({
      where: {
        account: link
      }
    })
      .then(result => {
        if (result) {
          if (result.UserId === req.decode.id) {
            const { id, account, email, UserId, password } = result;
            res.status(200).json({
              id,
              account,
              email,
              password,
              UserId
            });
          } else {
            const err = {
              name: "NotAuthorized",
              message: "You are not authorized"
            };
            throw err;
          }
        } else {
          next({
            name: "dataNotFound"
          });
        }
      })
      .catch(next);
  }
  static readById(req, res, next) {
    const id = +req.params.id;
    Password.findByPk(id)
      .then(password => {
        if (password) {
          const { id, account, email, UserId } = password;
          const randomSecret = getRandomSecret();
          redis.set("password" + id, randomSecret);
          const encryptedPassword = jwt.sign(password.password, randomSecret);
          res.status(200).json({
            id,
            account,
            email,
            password: encryptedPassword,
            UserId
          });
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
        password[0] === 0
          ? next({
              name: "dataNotFound"
            })
          : res.status(200).json({
              msg: "Update password success"
            });
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
        password === 0
          ? next({
              name: "dataNotFound"
            })
          : res.status(200).json({
              msg: "Delete password success"
            });
      })
      .catch(next);
  }
}

module.exports = PasswordController;
