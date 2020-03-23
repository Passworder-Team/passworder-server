const { User } = require("../models");

module.exports = {
  check(req, res, next) {
    const id = req.decode.id;
    User.findByPk(id)
      .then(User => {
        if (User) {
          next();
        } else {
          const err = {
            name: "NotAuthorized",
            message: "You not have authorization"
          };
          next(err);
        }
      })
      .catch(err => {
        const error = {
          name: "NotAuthorized",
          message: "You not have authorization"
        };
        next(error);
      });
  }
};
