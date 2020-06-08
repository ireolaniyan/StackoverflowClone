const chaiHttp = require("chai-http");
const chai = require("chai");
const { expect } = require('chai');

const app = require("../server");
const { getDb, dbModels } = require("../config/database.config")

chai.use(chaiHttp);

const User = dbModels.user

const userDetails = {
  first_name: "Adeola",
  last_name: "Olaniyan",
  email: "adeola@gmail.com",
  password: "111111q"
}
let token
const questionDetails = {
  title: "Async Await with Callbacks",
  content: "How should I implement an async-await callback function"
}

describe("Questions", () => {
  before(async () => {
    await User.create(userDetails)
    const res = await chai.request(app).post("/signin").send({ email: userDetails.email, password: userDetails.password })
    token = res.body.data.tokens[0].token
  })

  after(() => {
    const db = getDb()
    db.connection.db.dropDatabase()
  })

  describe("Create a Question", () => {
    it("Should successfully create a new question", async () => {
      const res = await chai.request(app).post("/ask-question").set('Authorization', `Bearer ${token}`).send(questionDetails)
      expect(res.status).to.eqls(201)
      expect(res.body.success).to.eqls(true)
    })
  })

  describe("Fetch Questions", () => {
    it("Should fetch authenticated user's questions", async () => {
      const res = await chai.request(app).get("/fetch-user-questions").set('Authorization', `Bearer ${token}`)
      expect(res.status).to.eqls(200)
      expect(res.body.success).to.eqls(true)
      expect(res.body.data).to.be.an('array')
    })

    it("Should fetch all questions in db", async () => {
      const res = await chai.request(app).get("/fetch-all-questions")
      expect(res.status).to.eqls(200)
      expect(res.body.success).to.eqls(true)
      expect(res.body.data).to.be.an("array")
    })
  })
})