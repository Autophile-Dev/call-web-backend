// __tests__/userRoutes.test.js
const request = require('supertest');
const app = require('../index'); // Assuming your app instance is exported from app.js

describe('User Routes', () => {
  // Test /create-user route
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/create-user')
      .send({
        // Provide sample data for testing
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNum: '1234567890',
        address: '123 Main St',
        city: 'City',
        dob: '1990-01-01',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('cmpUser');
    expect(res.body).toHaveProperty('cmpUserTheme');
  });

  // Test /create-user route when user already exists
  it('should not create a user if email already exists', async () => {
    const res = await request(app)
      .post('/create-user')
      .send({
        // Provide the same email as used in the previous test
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNum: '9876543210',
        address: '456 Second St',
        city: 'AnotherCity',
        dob: '1995-01-01',
        password: 'password456',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Email already exists');
  });

  // Test /user-login route
  it('should log in a user', async () => {
    const res = await request(app)
      .post('/user-login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('cmpUser');
    expect(res.body).toHaveProperty('cmpUserTheme');
    expect(res.body).toHaveProperty('token');
  });

  // Test /user-login route when user doesn't exist
  it('should not log in a user if user does not exist', async () => {
    const res = await request(app)
      .post('/user-login')
      .send({
        email: 'nonexistent.user@example.com',
        password: 'nonexistentpassword',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', `User Doesn't Exist`);
  });

  // Test /user-login route when password is incorrect
  it('should not log in a user if password is incorrect', async () => {
    const res = await request(app)
      .post('/user-login')
      .send({
        email: 'john.doe@example.com',
        password: 'incorrectpassword',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Password is incorrect');
  });
});
