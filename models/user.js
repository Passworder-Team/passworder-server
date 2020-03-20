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
            msg: "user name min 3 characters"
          },
          notEmpty: {
            args: true,
            msg: "user name cannot empty"
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
            msg: "email cannot empty"
          },
          isEmail: {
            args: true,
            msg: "format email is wrong"
          },
          isUnique: (value, next) => {
            sequelize.models.User.findOne({
              where: {
                email: value
              }
            })
              .then(costumer => {
                if (costumer) {
                  next("email is already used");
                } else {
                  next();
                }
              })
              .catch(next);
          }
        }
      },
      password: DataTypes.STRING
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
