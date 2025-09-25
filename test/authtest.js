const request = require("./setup");
const { expect } = require("chai");

describe("Auth", () => {
  it("should signup a user", async () => {
    const res = await request.post("/users/signup").send({
      name: "EJ",
      email: "ej@example.com",
      password: "testpass"
    });
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("message");
  });

  it("should login a user and return token", async () => {
    await request.post("/users/signup").send({
      name: "EJ",
      email: "ej@example.com",
      password: "testpass"
    });

    const res = await request.post("/auth/login").send({
      email: "ej@example.com",
      password: "testpass"
    });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
  });

  it("should login as admin", async () => {
    const res = await request.post("/auth/login").send({
      name: "admin",
      password: "admin"
    });
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("token");
  });
});
