// Ensure DATABASE_URL is set before importing modules that read it
import request from 'supertest';
import app from '../src/app.js';
import dotenv from 'dotenv';
dotenv.config();
describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('Should Return Health Status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  // test of Get /api
  describe('GET /api', () => {
    it('Should Return API Running Message', async () => {
      const response = await request(app).get('/api');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Acquisitions API is running!');
    });
  });

  // test of unknown route
  describe('GET /unknown-route', () => {
    it('Should Return 404 for Unknown Route', async () => {
      const response = await request(app).get('/unknown-route');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Route Not Found');
    });
  });
});