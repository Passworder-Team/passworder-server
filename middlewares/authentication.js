const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = {
  auth: async (req, res, next) => {
    try {
      const decoded = jwt.verify(req.headers.token, process.env.SECRET);
      const user = await User.findByPk(decoded.id);
      if (user) {
        req.decode = decoded;
        next();
      } else {
        const err = {
          name: "userNotFound"
        };
        next(err);
      }
    } catch (err) {
      next(err);
    }
  }
};
