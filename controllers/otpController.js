class OtpController {
  static generateOtp(req, res, next) {
    let otp = "";
    let randomChara = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let len = randomChara.length;
    for (let i = 0; i < 6; i++) {
      otp += randomChara[Math.round(Math.random() * len)];
    }
    req.otp = otp;
  }
  static compareOtp(req, res, next) {
    if (req.body.otp === req.otp) {
      res.status(200).json({
        msg: "succes, Otp matched"
      });
    } else {
      const err = {
        name: "wrongOtp",
        message: "Otp not matched, please input correct otp"
      };
      next(err);
    }
  }
}

module.exports = OtpController;
