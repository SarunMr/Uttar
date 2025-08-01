
// tests/questionDelete.test.js
const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../viable/db');
const User = require('../models/User');
const Question = require('../models/Question');
const jwt = require('jsonwebtoken');

describe('Delete Question API', () => {
  let token, userId, questionId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    const user = await User.create({
      firstName: 'Del',
      lastName: 'Tester',
      username: 'deltester',
      email: 'del@test.com',
      password: 'Password123!',
      gender: 'male',
      isActive: true,
    });
    userId = user.id;

    token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const question = await Question.create({
      title: 'Question to delete',
      description: 'Description of question',
      content: 'Content',
      authorId: userId,
    });

    questionId = question.id;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('DELETE /api/questions/:id - delete question successfully by owner', async () => {
    const response = await request(app)
      .delete(`/api/questions/${questionId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toMatch(/deleted successfully/i);
  });

  test('DELETE /api/questions/:id - fail deleting non-existent question', async () => {
    const response = await request(app)
      .delete('/api/questions/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/not found/i);
  });

  test('DELETE /api/questions/:id - fail deleting question not owned by user', async () => {
    // Create another user and question owned by them
    const otherUser = await User.create({
      firstName: 'Other',
      lastName: 'User',
      username: 'otheruser',
      email: 'other@test.com',
      password: 'Password123!',
      gender: 'female',
      isActive: true,
    });

    const otherQuestion = await Question.create({
      title: 'Other user question',
      description: 'Desc',
      content: 'Content',
      authorId: otherUser.id,
    });

    const response = await request(app)
      .delete(`/api/questions/${otherQuestion.id}`)
      .set('Authorization', `Bearer ${token}`);

    // Assuming authorization middleware restricts user to their own posts
    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/permission denied/i);
  });
});
