const request = require("supertest");
const app = require("../app");
const Sequelize = require("sequelize");
const Redis = require('ioredis')
const redis = new Redis()
const { User, Password, sequelize } = require("../models");
const { queryInterface } = sequelize;
const { createToken } = require("../helpers/jwt");
const phoneNumber = "+6285693338168"
let UserId = 0;
let PasswordId = 0;
let authorizedToken = "";
let unauthorizedToken = ""
let correctOtp = "";
let wrongOtp = ""


describe("OTP Routes", () => {
  describe("Get OTP test", () => {
    beforeAll(async (done) => {
      try {
        const user = await User.create({
          name: "admin",
          email: "admin@admin.com",
          password: "admin123",
          phoneNumber
        })
        UserId = user.id;
        authorizedToken = createToken({ id: UserId });
        const password = await Password.create({
          account: "www.Hacktiv8.com",
          email: "admin@admin.com",
          password: "admin123",
          UserId
        });
        PasswordId = password.id;
        const user2 = await User.create({
          name: "admin2",
          email: "admin2@admin.com",
          password: "admin123"
        })
        const unauthorizedId = user2.id
        unauthorizedToken = createToken({ id: unauthorizedId });
        done();
      } catch (err) {
        done(err)
      }
    });
    afterAll(async (done) => {
      try {
        await queryInterface.bulkDelete("Users", {})
        await queryInterface.bulkDelete("Passwords", {})
        done();
      } catch (err) {
        done(err)
      }
    });
    test("it should return Send OTP success and status 200", done => {
      request(app)
        .get("/otp/" + PasswordId)
        .set("token", authorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body.msg).toContain(`Send OTP to ${phoneNumber} success`);
          expect(response.body.result).toContain(`MessageID is`);
          expect(response.status).toBe(200);
          done();
        });
    });
    test("it should return error phone number required and status 400", done => {
      request(app)
        .get("/otp/" + PasswordId)
        .set("token", unauthorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Phone number is required. Please add your phone number to your account");
          expect(response.status).toBe(400);
          done();
        });
    });
  });
  describe("Compare OTP test", () => {
    beforeAll(async (done) => {
      try {
        const user = await User.create({
          name: "admin",
          email: "admin@admin.com",
          password: "admin123",
          phoneNumber
        })
        UserId = user.id;
        authorizedToken = createToken({ id: UserId });
        const password = await Password.create({
          account: "www.Hacktiv8.com",
          email: "admin@admin.com",
          password: "admin123",
          UserId
        });
        PasswordId = password.id;
        const user2 = await User.create({
          name: "admin2",
          email: "admin2@admin.com",
          password: "admin123"
        })
        const unauthorizedId = user2.id
        unauthorizedToken = createToken({ id: unauthorizedId });
        redis.set("otpPass" + PasswordId, '123456');
        redis.set("password" + PasswordId, 'secret');
        done();
      } catch (err) {
        done(err)
      }
    });
    afterAll(async (done) => {
      try {
        await queryInterface.bulkDelete("Users", {})
        await queryInterface.bulkDelete("Passwords", {})
        done();
      } catch (err) {
        done(err)
      }
    })
    test("it should return msg success otp matched, with status 200", done => {
      request(app)
        .post("/otp")
        .set("token", authorizedToken)
        .send({
          passId: PasswordId,
          otp: '123456'
        })
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("msg", "Success, Otp matched");
          expect(response.body).toHaveProperty("secret", "secret");
          expect(response.status).toBe(200);
          done()
        });
    });
    test("it should return error otp doesn\'t matched, with status 200", done => {
      request(app)
        .post("/otp")
        .set("token", authorizedToken)
        .send({
          passId: PasswordId,
          otp: '654321'
        })
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("msg", "Otp not matched, please input correct otp");
          expect(response.status).toBe(400);
          done()
        });
    });
  });
});
