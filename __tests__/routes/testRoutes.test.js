import request from 'supertest';
import express from 'express';
import router from '../../routes/testRoutes.js';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use('/api/test', router);

const PORT = 1234;
const server = app.listen(PORT);

const url = `http://localhost:${PORT}`;

describe('Test routes', () => {
	it('should return status 200 for GET request to /api/test/', async () => {
		const response = await request(url)
			.get('/api/test/');
		expect(response.status).toBe(200);
		expect(response.text).toBe('Hello World');
	});

	it('should return status 404 for GET request to non-existent route', async () => {
		const response = await request(url)
			.get('/api/nonexistent');
		expect(response.status).toBe(404);
	});

	// Add more test cases for other routes as needed
});

afterAll(async () => {
	await mongoose.connection.close();
	server.close();
});
