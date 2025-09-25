process.env.NODE_ENV = "test";

process.env.ADMIN_USER = process.env.ADMIN_USER || "admin";
process.env.ADMIN_PASS = process.env.ADMIN_PASS || "admin";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server");
const { User, Task } = require("../sequelize/models");

chai.use(chaiHttp);

beforeEach(async () => {
  try {
    await Task.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    
    if (process.env.NODE_ENV === 'test') {
      await User.sequelize.query("ALTER SEQUENCE \"Users_id_seq\" RESTART WITH 1");
      await Task.sequelize.query("ALTER SEQUENCE \"Tasks_id_seq\" RESTART WITH 1");
    }
  } catch (error) {
    console.log("Setup error:", error.message);
  }
});

after(async () => {
  try {
    await Task.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });

    await User.sequelize.close();
  } catch (error) {
    console.log("Cleanup error:", error.message);
  }
});

module.exports = chai.request;
module.exports.app = app;