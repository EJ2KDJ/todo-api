const { app } = require("./setup");
const chai = require("chai");
const { expect } = chai;

const request = () => chai.request(app);

describe("Auth", () => {
  // 1
  it("should signup a user", async () => {
    const res = await request()
      .post("/users/signup")
      .send({
        name: "EJ",
        email: "ej@example.com",
        password: "testpass"
      });
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("message");
  });

  //2
  it("should login a user and return token", async () => {
    await request()
      .post("/users/signup")
      .send({
        name: "EJ",
        email: "ej@example.com",
        password: "testpass"
      });

    const res = await request()
      .post("/auth/login")
      .send({
        email: "ej@example.com",
        password: "testpass"
      });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
    expect(res.body).to.have.property("message", "Login successful");
  });

  //3
  it("should login as admin", async () => {
    const res = await request()
      .post("/auth/login")
      .send({
        name: process.env.ADMIN_USER || "admin",
        password: process.env.ADMIN_PASS || "admin"
      });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
    expect(res.body).to.have.property("message", "Admin login successful");
  });

  // Additional test for invalid login
  it("should fail login with invalid credentials", async () => {
    const res = await request()
      .post("/auth/login")
      .send({
        email: "nonexistent@example.com",
        password: "wrongpassword"
      });

    expect(res).to.have.status(404);
    expect(res.body).to.have.property("error", "User not found");
  });
});