import request from 'supertest';
import { CONFIG } from './config';
import app from './index';

describe('API Gateway', () => {
  it('should authenticate user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'user@oclock.io', password: 'user' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should get products', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: 'user@oclock.io', password: 'user' });
    const token = loginResponse.body.token;

    const response = await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it('should get user cart', async () => {
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: 'user@oclock.io', password: 'user' });
    const token = loginResponse.body.token;

    const response = await request(app)
      .get('/carts/clients/2')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
