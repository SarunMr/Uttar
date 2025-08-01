
// tests/question.test.js
const request = require('supertest');
const app = require('../app'); // your Express app
const { sequelize } = require('../viable/db');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

describe('Question API', () => {
  let token, userId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create a test user
    const user = await User.create({
      firstName: 'Question',
      lastName: 'Tester',
      username: 'questiontester',
      email: 'question@test.com',
      password: 'Password123!',
      gender: 'other',
      isActive: true,
    });
    userId = user.id;

    // Generate JWT token for authentication
    token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('POST /api/questions - create new question successfully', async () => {
    const newQuestion = {
      title: 'How to unit test Express APIs?',
      description: 'I want to know best practices for testing Express routes.',
      content: 'Detailed question content here...',
      tags: ['testing', 'express', 'nodejs'],
    };

    const response = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${token}`)
      .send(newQuestion);

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.title).toBe(newQuestion.title);
    expect(response.body.data.tags).toEqual(expect.arrayContaining(['testing', 'express']));
  });

  test('POST /api/questions - fail without title', async () => {
    const incompleteQuestion = {
      description: 'Missing title field',
      content: 'Content...',
      tags: ['test'],
    };

    const response = await request(app)
      .post('/api/questions')
      .set('Authorization', `Bearer ${token}`)
      .send(incompleteQuestion);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/title/i);
  });
});
