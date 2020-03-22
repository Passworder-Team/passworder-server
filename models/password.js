"use strict";
module.exports = (sequelize, DataTypes) => {
  class Password extends sequelize.Sequelize.Model {}
  Password.init(
    {
      account: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Account cannot empty"
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Email cannot empty"
          },
          isEmail: {
            args: true,
            msg: "Email format is wrong"
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password cannot empty"
          },
          len: {
            args: [6],
            msg: "Password min 6 characters"
          }
        }
      },
      UserId: DataTypes.INTEGER
    },
    {
      sequelize
    }
  );
  Password.associate = function(models) {
    // associations can be defined here
    Password.belongsTo(models.User);
  };
  return Password;
};
