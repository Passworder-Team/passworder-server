const request = require("supertest");
const app = require("../app");
const Sequelize = require("sequelize");
const { User, Password, sequelize } = require("../models");
const { queryInterface } = sequelize;
const { createToken } = require("../helpers/jwt");
let UserId = 0;
let PasswordId = 0;
let testToken = "";

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
          testToken = createToken(res.dataValues);
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
        .set("token", testToken)
        .send({
          account: "Hacktiv8",
          email: "admin@admin.com",
          password: "admin123",
          UserId
        })
        .end((err, response) => {
          //   console.log("ini response", response.body);
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("id", expect.any(Number));
          expect(response.body).toHaveProperty("account", "Hacktiv8");
          expect(response.body).toHaveProperty("email", "admin@admin.com");
          expect(response.body).toHaveProperty("password", "admin123");
          expect(response.body).toHaveProperty(
            "msg",
            "Succesfuly input new password"
          );
          expect(response.status).toBe(201);
          done();
        });
    });
    test("it should return error 'Account cannot empty' and status 400", done => {
      request(app)
        .post("/passwords")
        .set("token", testToken)
        .send({
          account: "",
          email: "admin@admin.com",
          password: "admin123",
          UserId
        })
        .end((err, response) => {
          // console.log("ini response", response.body);
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Account cannot empty");
          expect(response.status).toBe(400);
          done();
        });
    });
    test("it should return error 'Email cannot empty' and status 400", done => {
      request(app)
        .post("/passwords")
        .set("token", testToken)
        .send({
          account: "Hacktiv8",
          email: "",
          password: "admin123",
          UserId
        })
        .end((err, response) => {
          // console.log("ini response", response.body);
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Email cannot empty");
          expect(response.status).toBe(400);
          done();
        });
    });
    test("it should return error 'Email format is wrong' and status 400", done => {
      request(app)
        .post("/passwords")
        .set("token", testToken)
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
        .set("token", testToken)
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
    test("it should return error 'Password cannot empty' and status 400", done => {
      request(app)
        .post("/passwords")
        .set("token", testToken)
        .send({
          account: "Hacktiv8",
          email: "admin@admin.com",
          password: "",
          UserId
        })
        .end((err, response) => {
          // console.log("ini response", response.body);
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Password cannot empty");
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
          testToken = createToken(res.dataValues);
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
        .set("token", testToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body[0]).toHaveProperty("account", "Hacktiv8");
          expect(response.body[0]).toHaveProperty("email", "admin@admin.com");
          expect(response.body[0]).toHaveProperty("password", "admin123");
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
    test("it should return error 'Cannot find Data', with status 404", done => {
      request(app)
        .get("/passwords")
        .set("token", testToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("msg", "Cannot find Data");
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
  describe("Get one Password test", () => {
    beforeAll(done => {
      User.create({
        name: "admin",
        email: "admin@admin.com",
        password: "admin123"
      })
        .then(res => {
          UserId = res.id;
          testToken = createToken(res.dataValues);
          return Password.create({
            account: "Hacktiv8",
            email: "admin@admin.com",
            password: "admin123",
            UserId
          });
        })
        .then(password => {
          PasswordId = password.id;
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
        .set("token", testToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("account", "Hacktiv8");
          expect(response.body).toHaveProperty("email", "admin@admin.com");
          expect(response.body).toHaveProperty("password", "admin123");
          expect(response.body).toHaveProperty("UserId", UserId);
          expect(response.status).toBe(200);
          queryInterface
            .bulkDelete("Passwords", {})
            .then(response => {
              done();
            })
            .catch(err => done(err));
        });
    });
    test("it should return error 'Cannot find Data', with status 404", done => {
      request(app)
        .get(`/passwords/${PasswordId}`)
        .set("token", testToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("msg", "Cannot find Data");
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
    test("it should return error 'You not have authorization', with status 401", done => {
      User.create({
        name: "admin",
        email: "admin2@admin.com",
        password: "admin123"
      })
        .then(res => {
          res.dataValues = res.id + 1;
          testToken = createToken(res.dataValues);
          return Password.create({
            account: "Hacktiv8",
            email: "admin2@admin.com",
            password: "admin123",
            UserId
          });
        })
        .then(password => {
          request(app)
            .get(`/passwords/${password.id}`)
            .set("token", testToken)
            .end((err, response) => {
              expect(err).toBe(null);
              expect(response.body).toHaveProperty(
                "msg",
                "You not have authorization"
              );
              expect(response.status).toBe(401);
              queryInterface
                .bulkDelete("Passwords", {})
                .then(response => {
                  done();
                })
                .catch(err => done(err));
            });
        })
        .catch(done);
    });
  });
  describe("Update Password test", () => {
    beforeAll(done => {
      User.create({
        name: "admin",
        email: "admin@admin.com",
        password: "admin123"
      })
        .then(res => {
          UserId = res.id;
          testToken = createToken(res.dataValues);
          return Password.create({
            account: "Hacktiv8",
            email: "admin@admin.com",
            password: "admin123",
            UserId
          });
        })
        .then(password => {
          PasswordId = password.id;
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
    test("it should return succes update with status 200", done => {
      request(app)
        .put(`/passwords/${PasswordId}`)
        .send({
          account: "Hacktiv",
          email: "admin5@admin.com",
          password: "admin23"
        })
        .set("token", testToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.status).toBe(200);
          done();
        });
    });
    test('it should return error "Cannot find data"', done => {
      request(app)
        .put(`/passwords/${PasswordId + 1}`)
        .send({
          account: "Hacktiv",
          email: "admin5@admin.com",
          password: "admin23"
        })
        .set("token", testToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("msg", "Cannot find Data");
          expect(response.status).toBe(404);
          done();
        });
    });
    test('it should return error validation "Account cannot empty"', done => {
      request(app)
        .put(`/passwords/${PasswordId}`)
        .set("token", testToken)
        .send({
          account: "",
          email: "admin5@admin.com",
          password: "admin23"
        })
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Account cannot empty");
          expect(response.status).toBe(400);
          done();
        });
    });
    test('it should return error validation "Email cannot empty"', done => {
      request(app)
        .put(`/passwords/${PasswordId}`)
        .set("token", testToken)
        .send({
          account: "Hacktiv",
          email: "",
          password: "admin23"
        })
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Email cannot empty");
          expect(response.status).toBe(400);
          done();
        });
    });
    test('it should return error validation "Email format is wrong"', done => {
      request(app)
        .put(`/passwords/${PasswordId}`)
        .set("token", testToken)
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
    test('it should return error validation "Password cannot empty"', done => {
      request(app)
        .put(`/passwords/${PasswordId}`)
        .set("token", testToken)
        .send({
          account: "Hacktiv",
          email: "admin5@admin.com",
          password: ""
        })
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Password cannot empty");
          expect(response.status).toBe(400);
          done();
        });
    });
    test('it should return error validation "Password min 6 characters"', done => {
      request(app)
        .put(`/passwords/${PasswordId}`)
        .set("token", testToken)
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
    test("it should return error 'You not have authorization', with status 401", done => {
      User.create({
        name: "admin",
        email: "admin2@admin.com",
        password: "admin123"
      })
        .then(res => {
          res.dataValues = res.id + 1;
          testToken = createToken(res.dataValues);
          return Password.create({
            account: "Hacktiv8",
            email: "admin2@admin.com",
            password: "admin123",
            UserId
          });
        })
        .then(password => {
          request(app)
            .get(`/passwords/${password.id}`)
            .set("token", testToken)
            .end((err, response) => {
              expect(err).toBe(null);
              expect(response.body).toHaveProperty(
                "msg",
                "You not have authorization"
              );
              expect(response.status).toBe(401);
              queryInterface
                .bulkDelete("Passwords", {})
                .then(response => {
                  done();
                })
                .catch(err => done(err));
            });
        })
        .catch(done);
    });
  });
  describe("Delete Password test", () => {
    beforeAll(done => {
      User.create({
        name: "admin",
        email: "admin4@admin.com",
        password: "admin123"
      })
        .then(res => {
          UserId = res.id;
          testToken = createToken(res.dataValues);
          return Password.create({
            account: "Hacktiv8",
            email: "admin@admin.com",
            password: "admin123",
            UserId
          });
        })
        .then(password => {
          PasswordId = password.id;
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
    test("it should return status 200", done => {
      request(app)
        .delete(`/passwords/${PasswordId}`)
        .set("token", testToken)
        .end((err, response) => {
          console.log(response.body);
          expect(err).toBe(null);
          expect(response.status).toBe(200);
          queryInterface
            .bulkDelete("Passwords", {})
            .then(response => {
              done();
            })
            .catch(err => done(err));
        });
    });
    test("it should return error 'Cannot find Data', with status 404", done => {
      request(app)
        .delete(`/passwords/${PasswordId}`)
        .set("token", testToken)
        .end((err, response) => {
          expect(err).toBe(null);
          expect(response.body).toHaveProperty("msg", "Cannot find Data");
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
    test("it should return error 'You not have authorization', with status 401", done => {
      User.create({
        name: "admin",
        email: "admin2@admin.com",
        password: "admin123"
      })
        .then(res => {
          res.dataValues = res.id + 1;
          testToken = createToken(res.dataValues);
          return Password.create({
            account: "Hacktiv8",
            email: "admin2@admin.com",
            password: "admin123",
            UserId
          });
        })
        .then(password => {
          request(app)
            .get(`/passwords/${password.id}`)
            .set("token", testToken)
            .end((err, response) => {
              expect(err).toBe(null);
              expect(response.body).toHaveProperty(
                "msg",
                "You not have authorization"
              );
              expect(response.status).toBe(401);
              queryInterface
                .bulkDelete("Passwords", {})
                .then(response => {
                  done();
                })
                .catch(err => done(err));
            });
        })
        .catch(done);
    });
  });
});
