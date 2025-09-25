const { app } = require("./setup");
const chai = require("chai");
const { expect } = chai;

const request = () => chai.request(app);

describe("Users", () => {
    // Helper function to get admin token
    const getAdminToken = async () => {
        const adminLogin = await request()
            .post("/auth/login")
            .send({
                name: process.env.ADMIN_USER || "admin",
                password: process.env.ADMIN_PASS || "admin"
            });
        expect(adminLogin).to.have.status(200);
        return adminLogin.body.token;
    };

    // Helper function to create user and get token
    const createUserAndLogin = async () => {
        const email = "test@emai.com";
        const signupRes = await request()
            .post("/users/signup")
            .send({
                name: "EJ",
                email,
                password: "testpass"
            });
        expect(signupRes).to.have.status(201);
        const userId = signupRes.body.user.id;

        const loginRes = await request()
            .post("/auth/login")
            .send({
                email: email,
                password: "testpass"
            });
        expect(loginRes).to.have.status(200);
        
        return {
            token: loginRes.body.token,
            userId
        };
    };

    //4
    it("retrieves all users (admin only)", async () => {
        const token = await getAdminToken();

        const res = await request()
            .get("/users")
            .set("Authorization", `Bearer ${token}`);
            
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
    });

    //5
    it("updates a user", async () => {
        const { token } = await createUserAndLogin();

        const res = await request()
            .put("/users/profile")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "EJ Updated" });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message","User updated successfully");
    });

    //7
    it("deletes a user (admin only)", async () => {
        const { userId } = await createUserAndLogin();
        const adminToken = await getAdminToken();

        const res = await request()
            .delete(`/users/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`)

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message","User deleted successfully");
    });
});