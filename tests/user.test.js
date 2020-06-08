const assert = require("assert");
const chaiHttp = require("chai-http");
const chai = require("chai");
const { expect } = require('chai');

const app = require("../server");
const { getDb } = require("../config/database.config")

chai.use(chaiHttp);

const userDetails = {
  first_name: "Adeola",
  last_name: "Olaniyan",
  email: "adeola@gmail.com",
  password: "111111q"
}

describe("Users", () => {
  after(() => {
    const db = getDb()
    db.connection.db.dropDatabase()
  })

  describe("Create User", () => {
    it("Should add a new user to the db", async () => {
      const res = await chai.request(app).post("/signup").send(userDetails)
      expect(res.status).to.eqls(201);
      expect(res.body.success).to.eqls(true);
      expect(res.body.data).to.be.an('object');
      expect(res.body.message).to.eqls("Successfully Created User")
    })

    it("Should not add a user with existing email", async () => {
      const res = await chai.request(app).post("/signup").send(userDetails)
      expect(res.status).to.eqls(400);
      expect(res.body.success).to.eqls(false);
      expect(res.body.message).to.eqls("Email Already Exists")
    })
  })

  describe("Authenticate User", () => {
    it("Should signin successfully", async () => {
      const res = await chai.request(app).post("/signin").send({ email: userDetails.email, password: userDetails.password })
      expect(res.status).to.eqls(200)
      expect(res.body.success).to.eqls(true)
      expect(res.body.data).to.be.an('object')
      expect(res.body.message).to.eqls("Sign-In Successful")
    })

    it("Should not signin for invalid credentials", async () => {
      const res = await chai.request(app).post("/signin").send({ email: "xyz@gmail.com", password: userDetails.password })
      expect(res.status).to.eqls(401)
      expect(res.body.success).to.eqls(false)
      expect(res.body.data).to.eqls("Invalid login credentials")
    })
  })

})