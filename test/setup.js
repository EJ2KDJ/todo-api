process.env.NODE_ENV = "test";

const chai = require("chai");
const app = require("../server");
const { User, Task } = require("../sequelize/models");

chai.use(chaiHttp);

beforeEach(async () => {
  // Clear DB before each test
  await Task.destroy({ where: {} });
  await User.destroy({ where: {} });
});

module.exports = chai.request(app);