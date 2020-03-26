const generateOtp = require("../helpers/generateOtp");
const { User } = require("../models");
const sendOtp = require("../helpers/sms_otp");
const Redis = require("ioredis");
const redis = new Redis();

class OtpController {
  static async getOtp(req, res, next) {
    const { passId } = req.params;
    const id = req.decode.id;
    const otp = generateOtp();
    try {
      const { phoneNumber } = await User.findByPk(id);
      const result = await sendOtp(otp, phoneNumber);
      redis.set("otpPass" + passId, otp);
      // console.log("MessageID is " + result.MessageId);
      setTimeout(() => {
        redis.del("otpPass" + passId);
        console.log("otpPass" + passId, "deleted");
      }, 300000);
      res.status(200).json({
        msg: `Send OTP to ${phoneNumber} success. Please check Your phone and input otp number.`,
        result: "MessageID is " + result.MessageId
      });
    } catch (err) {
      next(err);
    }
  }

  static async compareOtp(req, res, next) {
    const { passId, otp } = req.body
    try {
      const savedOtp = await redis.get("otpPass" + passId);
      if (otp === savedOtp) {
        const secret = await redis.get("password" + passId);
        res.status(200).json({
          msg: "Success, Otp matched",
          secret
        });
      } else {
        const err = {
          name: "wrongOtp",
          message: "Otp not matched, please input correct otp"
        };
        next(err);
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OtpController;
