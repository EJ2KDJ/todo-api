const request = require('./setup');
const { expect } = require('chai');

describe('Users', () => {
    it('retrieves all users (admin only)', async () => {
        const adminLogin = await request.post('/users/signup').send({
            name: 'admin',
            passwordL: 'admin'
        });

        const token = adminLogin.body.token;

        const res = await request
            .get('/users')
            .set('Authorization', `Bearer ${token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('users')
    });

    it('updates a user', async () => {
        const signupRes = await request.post('/users/signup').send({
            name: 'EJ',
            email: 'test@email.com',
            password: 'testpass'
        });
        expect(signupRes).to.have.status(201);
        const userId = signupRes.body.id;
        const res = await request.put(`/users/${userId}`).send({
            name: 'EJ Updated'
        });
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('User updated successfully');
    });

    it('deletes a user (admin only)', async () => {
        const adminLogin = await request.post("/auth/login").send({
            name: "admin",
            password: "admin"
        });
        const token = adminLogin.body.token;

        const signupRes = await request.post('/users/signup').send({
            name: 'EJ',
            email: 'test@email',
            password: 'testpass'
        });

        const deleteUserId = signupRes.body.id;

        const res = await request
            .delete(`/users/${deleteUserId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('User and associated tasks deleted successfully');
    });
});