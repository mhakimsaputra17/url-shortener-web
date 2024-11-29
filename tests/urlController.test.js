// tests/urlController.test.js
require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Url = require('../models/urlModel');

describe('URL Shortening Service API', () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect from the test database
    await mongoose.disconnect();
  });

  afterEach(async () => {
    // Clean up the database after each test
    await Url.deleteMany({});
  });

  describe('POST /api/v1/urls', () => {
    it('should create a new shortened URL', async () => {
      const res = await request(app)
        .post('/api/v1/urls')
        .send({ originalUrl: 'https://www.example.com' });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('shortCode');
      expect(res.body).toHaveProperty('shortUrl');
    });

    it('should return 400 for invalid URL', async () => {
      const res = await request(app)
        .post('/api/v1/urls')
        .send({ originalUrl: 'invalid-url' });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('code', 'INVALID_INPUT');
    });
  });

  describe('GET /:shortCode', () => {
    it('should redirect to the original URL', async () => {
      const url = await Url.create({ originalUrl: 'https://www.example.com' });
      const res = await request(app).get(`/${url.shortCode}`);
      expect(res.statusCode).toEqual(302);
      expect(res.headers.location).toEqual(url.originalUrl);
    });

    it('should return 404 for non-existent short code', async () => {
      const res = await request(app).get('/nonexistent');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('code', 'NOT_FOUND');
    });
  });

  describe('GET /api/v1/urls/:shortCode', () => {
    it('should get URL statistics', async () => {
      const url = await Url.create({ originalUrl: 'https://www.example.com' });
      const res = await request(app).get(`/api/v1/urls/${url.shortCode}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('shortCode', url.shortCode);
      expect(res.body).toHaveProperty('visitCount', 0);
    });

    it('should return 404 for non-existent short code', async () => {
      const res = await request(app).get('/api/v1/urls/nonexistent');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('code', 'NOT_FOUND');
    });
  });

  describe('DELETE /api/v1/urls/:shortCode', () => {
    it('should delete a shortened URL', async () => {
      const url = await Url.create({ originalUrl: 'https://www.example.com' });
      const res = await request(app).delete(`/api/v1/urls/${url.shortCode}`);
      expect(res.statusCode).toEqual(204);
    });

    it('should return 404 for non-existent short code', async () => {
      const res = await request(app).delete('/api/v1/urls/nonexistent');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('code', 'NOT_FOUND');
    });
  });

  describe('GET /api/v1/urls', () => {
    it('should list all URLs with pagination', async () => {
      await Url.create({ originalUrl: 'https://www.example.com' });
      const res = await request(app).get('/api/v1/urls?page=1&limit=10');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
    });
  });
});