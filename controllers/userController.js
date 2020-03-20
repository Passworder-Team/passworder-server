const { User } = require("../models");
const { createToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");

class UserController {
  static register(req, res, next) {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    User.create(newUser)
      .then(user => {
        const toToken = {
          name: user.name,
          email: user.email
        };
        const token = createToken(toToken);
        res.status(201).json(token);
      })
      .catch(next);
  }
  static login(req, res, next) {
    User.findOne({
      where: {
        name: req.body.name,
        email: req.body.email
      }
    })
      .then(user => {
        if (user) {
          const check = comparePassword(req.body.password, user.password);
          if (check) {
            const toToken = {
              name: user.name,
              email: user.email
            };
            const token = createToken(toToken);
            res.status(200).json(token);
          } else {
            const error = {
              name: "loginError",
              message: "email / password is wrong"
            };
            next(error);
          }
        } else {
          const error = {
            name: "loginError",
            message: "email / password is wrong"
          };
          next(error);
        }
      })
      .catch(next);
  }
}

module.exports = UserController;