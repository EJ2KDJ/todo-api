const { app } = require("./setup");
const chai = require("chai");
const { expect } = chai;

const request = () => chai.request(app);

describe("Tasks", () => {
    // Helper function to create user and get token
    const createUserAndLogin = async () => {
        const email = "test@email.com";
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

    //8
    it("creates a task for a user", async () => {
        const { token } = await createUserAndLogin();

        const res = await request()
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test Task",
                status: "pending",
                details: "This is a test task"
            });

        expect(res).to.have.status(201);
        expect(res.body).to.have.property("name", "Test Task");
    });

    //9
    it("retrieves tasks for a user", async () => {
        const { token } = await createUserAndLogin();

        const res = await request()
            .get("/tasks")
            .set("Authorization", `Bearer ${token}`);

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
    });

    //10
    it("updates a task", async () => {
        const { token } = await createUserAndLogin();

        const taskRes = await request()
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Initial Task",
                status: "pending",
                details: "This is the initial task"
            });
        expect(taskRes).to.have.status(201);
        const taskId = taskRes.body.id;

        const res = await request()
            .put(`/tasks/${taskId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Task",
                status: "completed"
            });

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("status", "completed");
    });

    //11
    it("deletes a task", async () => {
        const { token } = await createUserAndLogin();

        const taskRes = await request()
            .post("/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Task to be deleted",
                status: "pending",
                details: "This task will be deleted"
            });
        expect(taskRes).to.have.status(201);
        const taskId = taskRes.body.id;

        const res = await request()
            .delete(`/tasks/${taskId}`)
            .set("Authorization", `Bearer ${token}`);
            
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message", "Task deleted successfully");
    });
});