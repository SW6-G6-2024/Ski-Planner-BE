import request from 'supertest';
import express from 'express';
import router from '../../routes/routingRoutes.js';
import err from '../../utils/errorCodes.js';

const app = express();
app.use(express.json());
app.use('/api/routes', router);

const PORT = 1234;
const server = app.listen(PORT);

describe('Routing Routes', () => {
	test('POST /api/routes/generate-route should return shortest route from a to b', async () => {
		const data = {
			start: { lat: 1, lng: 1 },
			end: { lat: 2, lng: 2 },
			skiArea: 'test'
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		//expect(response.status).toBe(200);
		expect(response.body).toEqual({route: 'Dis way!', res: {
			data: {
				start: {lat: 1, lng: 1}, 
				end: {lat: 2, lng: 2}
			}}
		});
	})

	test('POST /api/routes/generate-route should return 400 if start or end is missing', async () => {
		const data = {
			start: { lat: 1, lng: 1 },
			skiArea: 'test'
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.routeGeneration.missingPoint);
	});
});

test('POST /api/routes/generate-route should return 400 if skiArea is missing', async () => {
	const data = {
		start: { lat: 1, lng: 1 },
		end: { lat: 2, lng: 2 }
	};
	const response = await request(app)
		.post('/api/routes/generate-route')
		.send(data);
	expect(response.status).toBe(400);
	expect(response.body).toEqual(err.routeGeneration.missingSkiArea);
});

test('POST /api/routes/generate-route should return 400 if start or end is not an object', async () => {
	const data = {
		start: 1,
		end: { lat: 2, lng: 2 },
		skiArea: 'test'
	};
	const response = await request(app)
		.post('/api/routes/generate-route')
		.send(data);
	expect(response.status).toBe(400);
	expect(response.body).toEqual(err.routeGeneration.invalidPoint);
});


afterAll(() => {
	// You're my wonderwaaaaallllll
	server.close();
});