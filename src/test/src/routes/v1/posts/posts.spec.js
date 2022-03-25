const request = require('supertest');

const { associate } = require('database/sync');
const app = require('app');
const { mockPost } = require('test/mock');
const { generateToken, validateSchema } = require('test/helper');
const { readSchema, listSchema } = require('./schema');

associate();

describe('/api/v1/posts', () => {
  let payload = null;
  let user = null;
  let post = null;
  beforeEach(async () => {
    const mock = await mockPost();
    payload = mock.payload;
    user = mock.user;
    post = mock.post;
  });
  it('[POST] /', async () => {
    const { token } = await generateToken(user.email);
    const { statusCode } = await request(app)
      .post('/api/v1/posts')
      .send(payload)
      .set('Cookie', token);

    expect(statusCode).toBe(201);
  });
  it('[GET] ?page=&limit=', async () => {
    const { statusCode, body } = await request(app)
      .get('/api/v1/posts')
      .query({ page: 1, limit: 10 });

    expect(validateSchema(listSchema, body)).toBe(true);
    expect(statusCode).toBe(200);
  });
  it('[GET] /:postId', async () => {
    const { statusCode, body } = await request(app).get(
      `/api/v1/posts/${post.id}`,
    );

    expect(validateSchema(readSchema, body)).toBe(true);
    expect(statusCode).toBe(200);
  });
  it('[PATCH] /:postId', async () => {
    const { token } = await generateToken(user.email);
    const { statusCode } = await request(app)
      .patch(`/api/v1/posts/${post.id}`)
      .send(payload)
      .set('Cookie', token);

    expect(statusCode).toBe(200);
  });
  it('[DELETE] /:postId', async () => {
    const { token } = await generateToken(user.email);
    const { statusCode } = await request(app)
      .delete(`/api/v1/posts/${post.id}`)
      .set('Cookie', token);

    expect(statusCode).toBe(200);
  });
});
