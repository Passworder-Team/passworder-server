const { User } = require("../models");
const { createToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcrypt");

class UserController {
  static register(req, res, next) {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber
    };
    User.create(newUser)
      .then(user => {
        const toToken = {
          id: user.id
        };
        const token = createToken(toToken);
        res.status(201).json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: req.body.phoneNumber
          },
          token,
          msg: "Register success"
        });
      })
      .catch(next);
  }
  static login(req, res, next) {
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(user => {
        const error = {
          name: "invalid email/password",
          message: "email / password is wrong"
        };
        if (user) {
          const check = comparePassword(req.body.password, user.password);
          if (check) {
            const toToken = {
              id: user.id
            };
            const token = createToken(toToken);
            res.status(200).json({
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber
              },
              token,
              msg: "Login success"
            });
          } else throw error;
        } else next(error);
      })
      .catch(next);
  }
}

module.exports = UserController;
