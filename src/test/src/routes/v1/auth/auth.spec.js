const request = require('supertest');

const app = require('app');
const { mockUser } = require('test/mock');
const { generateToken } = require('test/helper');

describe('/api/v1/auth', () => {
  let payload = null;
  let user = null;
  beforeEach(async () => {
    const mock = await mockUser();
    payload = mock.payload;
    user = mock.user;
  });
  it('[POST] /register', async () => {
    const { statusCode } = await request(app)
      .post('/api/v1/auth/register')
      .send(payload);

    expect(statusCode).toBe(201);
  });
  it('[POST] /login', async () => {
    const { email } = user;
    const { statusCode } = await request(app)
      .post('/api/v1/auth/login')
      .send({ email, password: 'password' });

    expect(statusCode).toBe(200);
  });
  it('[POST] /logout', async () => {
    const { token } = await generateToken(user.email);

    const { statusCode } = await request(app)
      .post('/api/v1/auth/logout')
      .set('Cookie', token);

    expect(statusCode).toBe(200);
  });
});
