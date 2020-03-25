const { Password } = require("../models");

module.exports = {
  authorization: async (req, res, next) => {
    const userId = req.decode.id;
    const passId = req.params.id;
    // try {
    const password = await Password.findByPk(passId);
    if (password) {
      if (userId === password.UserId) next();
      else
        next({
          name: "NotAuthorized",
          message: "You are not authorized"
        });
    } else {
      next({
        name: "passNotFound",
        msg: `Password with id ${passId} not found`
      });
    }
    // } catch (err) {
    //   next(err);
    // }
  }
};
