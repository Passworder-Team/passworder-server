const request = require("supertest");
const app = require("../app");
const Sequelize = require("sequelize");
const { User, sequelize } = require("../models");
const { queryInterface } = sequelize;

describe("User Routes", () => {
  describe("User Register Test", () => {
    beforeEach(done => {
      User.create({
        name: "nafies",
        email: "nafies.beta1@gmail.com",
        password: "mantapjiwa"
      })
        .then(_ => done())
        .catch(err => done(err));
    });
    afterEach(done => {
      queryInterface
        .bulkDelete("Users", {})
        .then(response => done())
        .catch(err => done(err));
    });

    test("it should return new user object, token, and status 201", done => {
      request(app)
        .post("/auth/register")
        .send({
          name: "nafies",
          email: "nafies.beta2@gmail.com",
          password: "mantapjiwa"
        })
        .end((err, response) => {
          // console.log('ini response',response.body)
          expect(err).toBe(null)
          expect(response.body).toHaveProperty('email', 'nafies.beta2@gmail.com')
          expect(response.body).toHaveProperty('name', 'nafies')
          expect(response.body).toHaveProperty('id', expect.any(Number))
          expect(response.body).toHaveProperty('token', expect.any(String))
          expect(response.body).toHaveProperty('msg', 'Register success')
          expect(response.status).toBe(201)
          done()
        })
    })

    /*
    test('it should return error email is not valid and status 400', (done) => {
      request(app)
        .post('/auth/register')
        .send({
          name: 'nafies',
          email: 'asd@asd.id',
          password: 'mantapjiwa'
        })
        .end((err, response) => {
          // console.log('ini response',response.body)
          expect(err).toBe(null)
          expect(response.body).toHaveProperty('msg', 'email is not valid. please use a valid email')
          expect(response.status).toBe(400)
          done()
        })
    }) */

    test("it should return error email is empty and status 400", done => {
      request(app)
        .post("/auth/register")
        .send({
          name: "nafies",
          email: "",
          password: "mantapjiwa"
        })
        .end((err, response) => {
          // console.log("ini response", response.body);
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Email cannot be empty");
          expect(response.status).toBe(400);
          done();
        });
    });

    test("it should return error email format is wrong and status 400", done => {
      request(app)
        .post("/auth/register")
        .send({
          name: "nafies",
          email: "email",
          password: "mantapjiwa"
        })
        .end((err, response) => {
          // console.log('ini response',response.body)
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Email format is wrong");
          expect(response.status).toBe(400);
          done();
        });
    });

    test("it should return error email is already  used and status 400", done => {
      request(app)
        .post("/auth/register")
        .send({
          name: "nafies",
          email: "nafies.beta1@gmail.com",
          password: "mantapjiwa"
        })
        .end((err, response) => {
          // console.log('ini response',response.body)
          expect(err).toBe(null);
          expect(response.body.msg).toContain("Email is already used");
          expect(response.status).toBe(400);
          done();
        });
    });

    test("it should return error password is empty and status 400", done => {
      request(app)
        .post("/auth/register")
        .send({
          name: "nafies",
          email: "nafies1@nafies.tech",
          password: ""
        })
        .end((err, response) => {
          // console.log('ini response',response.body)
          expect(err).toBe(null);
          expect(response.body.msg).toContain(
            "Password cannot be empty or null"
          );
          expect(response.status).toBe(400);
          done();
        });
    });

    test("it should return error name is empty and status 400", done => {
      request(app)
        .post("/auth/register")
        .send({
          name: "",
          email: "nafies1@nafies.tech",
          password: "mantapjiwa"
        })
        .end((err, response) => {
          // console.log('ini response',response.body)
          expect(err).toBe(null);
          expect(response.body.msg).toContain("User name cannot be empty");
          expect(response.status).toBe(400);
          done();
        });
    });

    test("it should return error name is too short and status 400", done => {
      request(app)
        .post("/auth/register")
        .send({
          name: "na",
          email: "nafies1@nafies.tech",
          password: "mantapjiwa"
        })
        .end((err, response) => {
          // console.log('ini response',response.body)
          expect(err).toBe(null);
          expect(response.body.msg).toContain("User name min 3 characters");
          expect(response.status).toBe(400);
          done();
        });
    });

    test("it should return error password is too short and status 400", done => {
      request(app)
        .post("/auth/register")
        .send({
          name: "nafies",
          email: "nafies1@nafies.tech",
          password: "man"
        })
        .end((err, response) => {
          // console.log('ini response',response.body)
          expect(err).toBe(null);
          expect(response.body.msg).toContain(
            "Password is too short. Minimum password length is 6"
          );
          expect(response.status).toBe(400);
          done();
        });
    });
  });

  describe("User Login Test", () => {
    beforeEach(done => {
      User.create({
        name: "nafies",
        email: "nafies.beta2@gmail.com",
        password: "mantapjiwa"
      })
        .then(_ => done())
        .catch(err => done(err));
    });
    afterEach(done => {
      queryInterface
        .bulkDelete("Users", {})
        .then(response => done())
        .catch(err => done(err));
    });

    test("it should return user object, token, and status 200", done => {
      request(app)
        .post("/auth/login")
        .send({
          email: "nafies.beta2@gmail.com",
          password: "mantapjiwa"
        })
        .end((err, response) => {
          // console.log('ini response',response.body)
          expect(err).toBe(null)
          expect(response.body).toHaveProperty('email', 'nafies.beta2@gmail.com')
          expect(response.body).toHaveProperty('name', 'nafies')
          expect(response.body).toHaveProperty('id', expect.any(Number))
          expect(response.body).toHaveProperty('token', expect.any(String))
          expect(response.body).toHaveProperty('msg', 'Login success')
          expect(response.status).toBe(200)
          done()
        })
    })

    test("it should return error username/password is wrong, and status 400", done => {
      request(app)
        .post("/auth/login")
        .send({
          email: "nafies@nafies.tech",
          password: "mantapjia"
        })
        .end((err, response) => {
          // console.log('ini response',response.body)
          expect(err).toBe(null);
          expect(response.body).toHaveProperty(
            "name",
            "invalid email/password"
          );
          expect(response.body).toHaveProperty(
            "msg",
            "Email / Password is wrong"
          );
          expect(response.status).toBe(400);
          done();
        });
    });
  });
});
