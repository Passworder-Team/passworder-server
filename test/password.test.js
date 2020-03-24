const request = require("supertest");
const app = require("../app");
const Sequelize = require("sequelize");
const { User, Password, sequelize } = require("../models");
const { queryInterface } = sequelize;
const { createToken } = require("../helpers/jwt");
let UserId = 0;
let PasswordId = 0;
let authorizedToken = "";
let unauthorizedToken = ""

describe("Password Routes", () => {
  describe("New Password input test", () => {
    beforeAll(done => {
      User.create({
        name: "admin",
        email: "admin@admin.com",
        password: "admin123"
      })
        .then(res => {
          UserId = res.id;
          authorizedToken = createToken(res.dataValues);
          done();
        })
        .catch(done);
    });
    afterAll(done => {
      queryInterface
        .bulkDelete("Passwords", {})
        .then(response => {
          done();
        })
        .catch(err => done(err));
      queryInterface
        .bulkDelete("Users", {})
        .then(response => {
          done();
        })
        .catch(err => done(err));
    });
    test("it should return new password object, token, and status 201", done => {
      request(app)
        .post("/passwords")
        .set("token", authorizedToken)
        .send({
          account: "Hacktiv8",
          email: "admin@admin.com",
          password: "admin123",
          UserId
        })
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body.data).toHaveProperty("id", expect.any(Number));
          expect(response.body.data).toHaveProperty("account", "Hacktiv8");
          expect(response.body.data).toHaveProperty("email", "admin@admin.com");
          expect(response.body).toHaveProperty(
            "msg",
            "Succesfuly input new password"
          );
          expect(response.status).toBe(201);
          done();
        });
    });
    test("it should return error 'Account can't be empty' and status 400", done => {
      request(app)
        .post("/passwords")
        .set("token", authorizedToken)
        .send({
          account: "",
          email: "admin@admin.com",
          password: "admin123",
          UserId
        })
        .end((err, response) => {
          // console.log("ini response", response.body);
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Account can't be empty");
          expect(response.status).toBe(400);
          done();
        });
    });
    test("it should return error 'Email can't be empty' and status 400", done => {
      request(app)
        .post("/passwords")
        .set("token", authorizedToken)
        .send({
          account: "Hacktiv8",
          email: "",
          password: "admin123",
          UserId
        })
        .end((err, response) => {
          // console.log("ini response", response.body);
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Email can't be empty");
          expect(response.status).toBe(400);
          done();
        });
    });
    test("it should return error 'Email format is wrong' and status 400", done => {
      request(app)
        .post("/passwords")
        .set("token", authorizedToken)
        .send({
          account: "Hacktiv8",
          email: "adminadmin.com",
          password: "admin123",
          UserId
        })
        .end((err, response) => {
          // console.log("ini response", response.body);
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Email format is wrong");
          expect(response.status).toBe(400);
          done();
        });
    });
    test("it should return error 'Password min 6 characters' and status 400", done => {
      request(app)
        .post("/passwords")
        .set("token", authorizedToken)
        .send({
          account: "Hacktiv8",
          email: "admin@admin.com",
          password: "admin",
          UserId
        })
        .end((err, response) => {
          // console.log("ini response", response.body);
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Password min 6 characters");
          expect(response.status).toBe(400);
          done();
        });
    });
    test("it should return error 'Password can't be empty' and status 400", done => {
      request(app)
        .post("/passwords")
        .set("token", authorizedToken)
        .send({
          account: "Hacktiv8",
          email: "admin@admin.com",
          password: "",
          UserId
        })
        .end((err, response) => {
          // console.log("ini response", response.body);
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Password can't be empty");
          expect(response.status).toBe(400);
          done();
        });
    });
    test("it should return error 'You must login first', with status 401", done => {
      request(app)
        .get("/passwords")
        .set("token", "")
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("msg", "You must login first");
          expect(response.status).toBe(401);
          done();
        });
    });
  });
  describe("Get all Password test", () => {
    beforeAll(done => {
      User.create({
        name: "admin",
        email: "admin3@admin.com",
        password: "admin123"
      })
        .then(res => {
          UserId = res.id;
          authorizedToken = createToken(res.dataValues);
          return Password.create({
            account: "Hacktiv8",
            email: "admin@admin.com",
            password: "admin123",
            UserId
          });
        })
        .then(password => {
          done();
        })
        .catch(done);
    });
    afterAll(done => {
      queryInterface
        .bulkDelete("Users", {})
        .then(response => {
          done();
        })
        .catch(err => done(err));
    });
    test("it should return array of object password, with status 200", done => {
      request(app)
        .get("/passwords")
        .set("token", authorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body[0]).toHaveProperty("account", "Hacktiv8");
          expect(response.body[0]).toHaveProperty("email", "admin@admin.com");
          expect(response.body[0]).toHaveProperty("UserId", UserId);
          expect(response.status).toBe(200);
          queryInterface
            .bulkDelete("Passwords", {})
            .then(response => {
              done();
            })
            .catch(err => done(err));
        });
    });
    test("it should return error 'Can't find Data', with status 404", done => {
      request(app)
        .get("/passwords")
        .set("token", authorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("msg", "Can't find Data");
          expect(response.status).toBe(404);
          done();
        });
    });
    test("it should return error 'You must login first', with status 401", done => {
      request(app)
        .get("/passwords")
        .set("token", "")
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("msg", "You must login first");
          expect(response.status).toBe(401);
          done();
        });
    });
  });
  describe("Get one Password by link test", () => {
    beforeAll(done => {
      User.create({
        name: "admin",
        email: "admin@admin.com",
        password: "admin123"
      })
        .then(user => {
          UserId = user.id;
          authorizedToken = createToken({ id: UserId });
          return Password.create({
            account: "www.Hacktiv8.com",
            email: "admin@admin.com",
            password: "admin123",
            UserId
          });
        })
        .then(password => {
          PasswordId = password.id;
          return User.create({
            name: "admin2",
            email: "admin2@admin.com",
            password: "admin123"
          })
        })
        .then(user => {
          const unauthorizedId = user.id
          unauthorizedToken = createToken({ id: unauthorizedId });
          done();
        })
        .catch(done);
    });
    afterAll(done => {
      queryInterface
        .bulkDelete("Users", {})
        .then(response => {
          done();
        })
        .catch(err => done(err));
    });
    test("it should return object password, with status 200", done => {
      request(app)
        .get("/passwords/link/www.Hacktiv8.com")
        .set("token", authorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("account", "www.Hacktiv8.com");
          expect(response.body).toHaveProperty("email", "admin@admin.com");
          expect(response.body).toHaveProperty("password", expect.any(String));
          expect(response.body).toHaveProperty("UserId", UserId);
          expect(response.status).toBe(200);
          done()
        });
    });
    test("it should return error 'Can't find Data', with status 404", done => {
      request(app)
        .get("/passwords/link/www.Facebook.com")
        .set("token", authorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("msg", "Can't find Data");
          expect(response.status).toBe(404);
          done();
        });
    });
    test("it should return error 'You must login first', with status 401", done => {
      request(app)
        .get("/passwords/link/www.Hacktiv8.com")
        .set("token", "")
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("msg", "You must login first");
          expect(response.status).toBe(401);
          done();
        });
    });
    test("it should return error 'You are not authorized', with status 401", done => {
      request(app)
        .get("/passwords/link/www.Hacktiv8.com")
        .set("token", unauthorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty(
            "msg",
            "You are not authorized"
          );
          expect(response.status).toBe(401);
          done()
        });
    });
  });
  describe("Get one Password by id test", () => {
    beforeAll(done => {
      User.create({
        name: "admin",
        email: "admin@admin.com",
        password: "admin123"
      })
        .then(user => {
          UserId = user.id;
          authorizedToken = createToken({ id: UserId });
          return Password.create({
            account: "www.Hacktiv8.com",
            email: "admin@admin.com",
            password: "admin123",
            UserId
          });
        })
        .then(password => {
          PasswordId = password.id;
          return User.create({
            name: "admin2",
            email: "admin2@admin.com",
            password: "admin123"
          })
        })
        .then(user => {
          const unauthorizedId = user.id
          unauthorizedToken = createToken({ id: unauthorizedId });
          done();
        })
        .catch(done);
    });
    afterAll(done => {
      queryInterface
        .bulkDelete("Users", {})
        .then(response => {
          done();
        })
        .catch(err => done(err));
    });
    test("it should return object password, with status 200", done => {
      request(app)
        .get(`/passwords/${PasswordId}`)
        .set("token", authorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("account", "www.Hacktiv8.com");
          expect(response.body).toHaveProperty("email", "admin@admin.com");
          expect(response.body).toHaveProperty("password", expect.any(String));
          expect(response.body).toHaveProperty("UserId", UserId);
          expect(response.status).toBe(200);
          done()
        });
    });
    test("it should return error 'Password with id ... not found', with status 404", done => {
      request(app)
        .get(`/passwords/${PasswordId + 1}`)
        .set("token", authorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty(
            "msg",
            `Password with id ${PasswordId + 1} not found`
          );
          expect(response.status).toBe(404);
          done();
        });
    });
    test("it should return error 'You must login first', with status 401", done => {
      request(app)
        .get(`/passwords/${PasswordId}`)
        .set("token", "")
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("msg", "You must login first");
          expect(response.status).toBe(401);
          done();
        });
    });
    test("it should return error 'You are not authorized', with status 401", done => {
      request(app)
        .get(`/passwords/${PasswordId}`)
        .set("token", unauthorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty(
            "msg",
            "You are not authorized"
          );
          expect(response.status).toBe(401);
          done()
        });
    });
  });
  describe("Update Password test", () => {
    beforeAll(done => {
      User.create({
        name: "admin",
        email: "admin@admin.com",
        password: "admin123"
      })
        .then(user => {
          UserId = user.id;
          authorizedToken = createToken({ id: UserId });
          return Password.create({
            account: "www.Hacktiv8.com",
            email: "admin@admin.com",
            password: "admin123",
            UserId
          });
        })
        .then(password => {
          PasswordId = password.id;
          return User.create({
            name: "admin2",
            email: "admin2@admin.com",
            password: "admin123"
          })
        })
        .then(user => {
          const unauthorizedId = user.id
          unauthorizedToken = createToken({ id: unauthorizedId });
          done();
        })
        .catch(done);
    });
    afterAll(done => {
      queryInterface
        .bulkDelete("Users", {})
        .then(response => {
          done();
        })
        .catch(err => done(err));
      queryInterface
        .bulkDelete("Passwords", {})
        .then(response => {
          done();
        })
        .catch(err => done(err));
    });
    test("it should return success update with status 200", done => {
      request(app)
        .put(`/passwords/${PasswordId}`)
        .send({
          account: "Hacktiv",
          email: "admin5@admin.com",
          password: "admin23"
        })
        .set("token", authorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty(
            "msg",
            "Update password success"
          );
          expect(response.status).toBe(200);
          done();
        });
    });
    test("it should return error 'Password with id ... not found'", done => {
      request(app)
        .put(`/passwords/${PasswordId + 1}`)
        .send({
          account: "Hacktiv",
          email: "admin5@admin.com",
          password: "admin23"
        })
        .set("token", authorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty(
            "msg",
            `Password with id ${PasswordId + 1} not found`
          );
          expect(response.status).toBe(404);
          done();
        });
    });
    test("it should return error validation 'Account can't be empty'", done => {
      request(app)
        .put(`/passwords/${PasswordId}`)
        .set("token", authorizedToken)
        .send({
          account: "",
          email: "admin5@admin.com",
          password: "admin23"
        })
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Account can't be empty");
          expect(response.status).toBe(400);
          done();
        });
    });
    test("it should return error validation 'Email can't be empty'", done => {
      request(app)
        .put(`/passwords/${PasswordId}`)
        .set("token", authorizedToken)
        .send({
          account: "Hacktiv",
          email: "",
          password: "admin23"
        })
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Email can't be empty");
          expect(response.status).toBe(400);
          done();
        });
    });
    test('it should return error validation "Email format is wrong"', done => {
      request(app)
        .put(`/passwords/${PasswordId}`)
        .set("token", authorizedToken)
        .send({
          account: "Hacktiv",
          email: "adminadmin.com",
          password: "admin23"
        })
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Email format is wrong");
          expect(response.status).toBe(400);
          done();
        });
    });
    test("it should return error validation 'Password can't be empty'", done => {
      request(app)
        .put(`/passwords/${PasswordId}`)
        .set("token", authorizedToken)
        .send({
          account: "Hacktiv",
          email: "admin5@admin.com",
          password: ""
        })
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Password can't be empty");
          expect(response.status).toBe(400);
          done();
        });
    });
    test('it should return error validation "Password min 6 characters"', done => {
      request(app)
        .put(`/passwords/${PasswordId}`)
        .set("token", authorizedToken)
        .send({
          account: "Hacktiv",
          email: "admin5@admin.com",
          password: "admin"
        })
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Password min 6 characters");
          expect(response.status).toBe(400);
          done();
        });
    });
    test("it should return error 'You are not authorized', with status 401", done => {
      request(app)
        .put(`/passwords/${PasswordId}`)
        .set("token", unauthorizedToken)
        .send({
          account: "Hacktiv",
          email: "admin5@admin.com",
          password: "admin"
        })
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty(
            "msg",
            "You are not authorized"
          );
          expect(response.status).toBe(401);
          done()
        });
    });
  });
  describe("Delete Password test", () => {
    beforeEach(done => {
      User.create({
        name: "admin",
        email: "admin@admin.com",
        password: "admin123"
      })
        .then(user => {
          UserId = user.id;
          authorizedToken = createToken({ id: UserId });
          return Password.create({
            account: "www.Hacktiv8.com",
            email: "admin@admin.com",
            password: "admin123",
            UserId
          });
        })
        .then(password => {
          PasswordId = password.id;
          return User.create({
            name: "admin2",
            email: "admin2@admin.com",
            password: "admin123"
          })
        })
        .then(user => {
          const unauthorizedId = user.id
          unauthorizedToken = createToken({ id: unauthorizedId });
          done();
        })
        .catch(done);
    });
    afterEach(done => {
      queryInterface
        .bulkDelete("Users", {})
        .then(response => {
          done();
        })
        .catch(err => done(err));
    });
    test("it should return success delete with status 200", done => {
      request(app)
        .delete(`/passwords/${PasswordId}`)
        .set("token", authorizedToken)
        .end((err, response) => {
          // console.log(response.body);
          expect(err).toBe(null);
          expect(response.status).toBe(200);
          done()
        });
    });
    test("it should return error 'Password with id ... not found', with status 404", done => {
      request(app)
        .delete(`/passwords/${PasswordId + 1}`)
        .set("token", authorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty(
            "msg",
            `Password with id ${PasswordId + 1} not found`
          );
          expect(response.status).toBe(404);
          done();
        });
    });
    test("it should return error 'You must login first', with status 401", done => {
      request(app)
        .delete(`/passwords/${PasswordId}`)
        .set("token", "")
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("msg", "You must login first");
          expect(response.status).toBe(401);
          done();
        });
    });
    test("it should return error 'You are not authorized', with status 401", done => {
      request(app)
        .delete(`/passwords/${PasswordId}`)
        .set("token", unauthorizedToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty(
            "msg",
            "You are not authorized"
          );
          expect(response.status).toBe(401);
          done()
        });
    });
  });
});
