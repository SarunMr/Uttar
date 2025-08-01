
// tests/profile.test.js
const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../viable/db');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Profile API', () => {
  let token;
  let testUser;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create a user manually in the DB:
    testUser = await User.create({
      firstName: 'Profile',
      lastName: 'Test',
      username: 'profiletest',
      email: 'profile@test.com',
      password: 'Password123!',
      gender: 'female',
      isActive: true,
    });

    token = jwt.sign({ userId: testUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('GET /api/auth/me - get current user profile', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id', testUser.id);
    expect(response.body.data).not.toHaveProperty('password');
    expect(response.body.data.username).toBe(testUser.username);
  });

  test('GET /api/auth/me - no token returns 401', async () => {
    const response = await request(app).get('/api/auth/me');
    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('GET /api/auth/me - invalid token returns 403', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });
});
