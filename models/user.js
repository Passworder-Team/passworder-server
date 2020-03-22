"use strict";
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends sequelize.Sequelize.Model {}
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [3],
            msg: "User name min 3 characters"
          },
          notEmpty: {
            args: true,
            msg: "User name cannot be empty"
          },
          isUnique: (value, next) => {
            sequelize.models.User.findOne({
              where: {
                email: value
              }
            })
              .then(costumer => {
                if (costumer) {
                  next("username is already used");
                } else {
                  next();
                }
              })
              .catch(next);
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Email cannot be empty"
          },
          isEmail: {
            args: true,
            msg: "Email format is wrong"
          },
          isUnique: (value, next) => {
            sequelize.models.User.findOne({
              where: {
                email: value
              }
            })
              .then(costumer => {
                if (costumer) {
                  next("Email is already used");
                } else {
                  next();
                }
              })
              .catch(next);
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password cannot be empty or null"
          },
          len: {
            args: [6],
            msg: "Password is too short. Minimum password length is 6"
          }
        }
      }
    },
    {
      sequelize,
      hooks: {
        beforeCreate: (user, options) => {
          user.password = hashPassword(user.password);
        }
      }
    }
  );
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Password);
  };
  return User;
};
