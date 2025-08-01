
// tests/auth.test.js
const request = require('supertest');
const app = require('../app'); // your Express app
const { sequelize } = require('../viable/db');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset DB before tests
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /api/auth/register - successful registration', async () => {
    const newUser = {
      firstName: 'Test',
      lastName: 'User',
      username: 'testuser123',
      email: 'testuser@example.com',
      password: 'Password123!',
      gender: 'other',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user).not.toHaveProperty('password');
    expect(response.body.data).toHaveProperty('token');
    expect(response.body.data.user.email).toBe(newUser.email);
  });

  test('POST /api/auth/register - duplicate email registration', async () => {
    const duplicateUser = {
      firstName: 'Another',
      lastName: 'User',
      username: 'anotheruser',
      email: 'testuser@example.com', // existing email
      password: 'Password123!',
      gender: 'male',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(duplicateUser);

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/email.*exists/i);
  });
});
