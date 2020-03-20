"use strict";
module.exports = (sequelize, DataTypes) => {
  class Password extends sequelize.Sequelize.Model {}
  Password.init(
    {
      account: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
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
