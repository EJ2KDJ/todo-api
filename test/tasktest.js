const request = require('./setup');
const { expect } = require('chai');

describe('Tasks', () => {
    it('creates a task for a user', async () => {
        const signupRes = await request.post('/users/signup').send({
            name: 'EJ',
            email: 'testt@email.com',
            password: 'testpass'
        });
        expect(signupRes).to.have.status(201);
        const userId = signupRes.body.id;

        const res = await request.post('/tasks').send({
            name: 'Test Task',
            status: 'pending',
            details: 'This is a test task',
            userId: userId
        });
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('name', 'Test Task');
    });

    it('retrieves tasks for a user', async () => {
        const signupRes = await request.post('/users/signup').send({
            name: 'EJ',
            email: 'test@email',
            password: 'testpass'
        });
        expect(signupRes).to.have.status(201);
        const userId = signupRes.body.id;
        const res = await request.get(`/tasks/user/${userId}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(0);
    });
    
    it('updates a task', async () => {
        const signupRes = await request.post('/users/signup').send({
            name: 'EJ',
            email: 'test@email',
            password: 'testpass'
        });
        expect(signupRes).to.have.status(201);
        const userId = signupRes.body.id;

        const taskRes = await request.post('/tasks').send({
            name: 'Initial Task',
            status: 'pending',
            details: 'This is the initial task',
            userId: userId
        });
        expect(taskRes).to.have.status(201);
        const taskId = taskRes.body.id;
        const res = await request.put(`/tasks/${taskId}`).send({
            name: 'Updated Task',
            status: 'completed'
        });
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name', 'Updated Task');
        expect(res.body).to.have.property('status', 'completed');
    });

    it('deletes a task', async () => {
        const signupRes = await request.post('/users/signup').send({
            name: 'EJ',
            email: 'test@email',
            password: 'testpass'
        });
        expect(signupRes).to.have.status(201);
        const userId = signupRes.body.id;

        const taskRes = await request.post('/tasks').send({
            name: 'Task to be deleted',
            status: 'pending',
            details: 'This task will be deleted',
            userId: userId
        });
        expect(taskRes).to.have.status(201);
        const taskId = taskRes.body.id;
        const res = await request.delete(`/tasks/${taskId}`);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Task deleted successfully');
    });
});