const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = {
  auth: async (req, res, next) => {
    try {
      const decoded = jwt.verify(req.headers.token, process.env.SECRET);
      const user = await User.findByPk(decoded.id);
      user
        ? ((req.decode = decoded), next())
        : next({
            name: "userNotFound"
          });
    } catch (err) {
      next(err);
    }
  }
};
