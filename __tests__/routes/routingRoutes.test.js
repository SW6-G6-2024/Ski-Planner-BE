import request from 'supertest';
import express from 'express';
import router from '../../routes/routingRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/route', router);

const PORT = 1234;
const server = app.listen(PORT);

describe('Routing Routes', () => {
	test('GET /api/routes should return shortest route from a to b', async () => {
		const response = await request(app)
			.get('/api/route/');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({route: 'Dis way!'});
	});
});

afterAll(() => {
	// You're my wonderwaaaaallllll
	server.close();
});