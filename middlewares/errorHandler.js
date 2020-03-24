module.exports = (err, req, res, next) => {
  const error = err;
  // console.log(error.stack);
  if (error.name === "SequelizeValidationError") {
    const messages = [];
    for (let i = 0; i < error.errors.length; i++) {
      messages.push(error.errors[i].message);
    }
    res.status(400).json({
      msg: messages
    });
  } else if (error.name === "transactionError") {
    res.status(400).json({
      msg: error.message
    });
  } else if (error.name === "invalid email/password") {
    res.status(400).json({
      name: error.name,
      msg: "Email / Password is wrong"
    });
  } else if (error.name === "dataNotFound") {
    res.status(404).json({
      msg: "Can't find Data"
    });
  } else if (error.name === "passNotFound") {
    res.status(404).json({
      msg: error.msg
    });
  } else if (error.name === "NotAuthorized") {
    res.status(401).json({
      msg: error.message
    });
  } else if (error.name === "SequelizeDatabaseError") {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  } else if (
    error.name === "JsonWebTokenError" ||
    error.name === "userNotFound"
  ) {
    res.status(401).json({
      msg: "You must login first"
    });
  } else if (error.name === "wrongOtp") {
    res.status(400).json({
      msg: error.message
    });
  } else {
    console.log(err);
    res.status(500).json({
      msg: "Internal Server Error"
    });
  }
};
