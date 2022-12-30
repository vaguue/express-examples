const userHelper = require('@/lib/user');
jest.mock('@/lib/user');
const redis = require('@/lib/redis');
jest.mock('@/lib/redis');
const sessionHelper = require('@/lib/session');
jest.mock('@/lib/session');

const app = require('@/root/app');
const request = require('supertest');

const token = 'Bearer token';

describe('auth routes', () => {
  it('/signup', async () => {
    await expect(
      request(app).post('/signup').send({ id: 'id', password: 'password' }).then(res => res.status)
    ).resolves.toEqual(200);
  });

  it('/signin', async () => {
    await expect(
      request(app).post('/signin').send({ id: 'id', password: 'password' }).then(res => res.status)
    ).resolves.toEqual(200);
    await expect(
      request(app).post('/signin').send({ id: 'id', password: 'wrong-password' }).then(res => res.status)
    ).resolves.toEqual(500);
  });

  it('/signin/new_token', async () => {
    await expect(
      request(app).post('/signin/new_token').set('Authorization', token).send({ refreshToken: 'incorrect-refresh-token'}).then(res => res.status)
    ).resolves.toEqual(500);
    await expect(
      request(app).post('/signin/new_token').set('Authorization', token).send({ refreshToken: 'refreshToken' }).then(res => res.status)
    ).resolves.toEqual(200);
  });

  it('/info', async () => {
    await expect(
      request(app).get('/info').set('Authorization', token).then(res => res.status)
    ).resolves.toEqual(200);
  });

  it('/logout', async () => {
    await expect(
      request(app).get('/logout').then(res => res.status)
    ).resolves.toEqual(250);
    await expect(
      request(app).get('/logout').set('Authorization', token).then(res => res.status)
    ).resolves.toEqual(200);
  });
});
