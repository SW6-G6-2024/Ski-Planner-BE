import request from 'supertest';
import express from 'express';
import router from '../../routes/routingRoutes.js';
import err from '../../utils/errorCodes.js';
import connectDb from '../fixtures/db.js';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';
import axios from 'axios';
import overpassExampleData from '../fixtures/overpassExampleData.js';
import generatedRouteExample from '../fixtures/generatedRouteExample.js';
import weatherResponseExample from '../fixtures/weatherResponse.js';
import ratingResponseExample from '../fixtures/ratingResponseExample.js';
import errorCodes from '../../utils/errorCodes.js';

const app = express();
app.use(express.json());
app.use('/api/routes', router);

const PORT = 5123;
const server = app.listen(PORT);

let db;
beforeAll(async () => {
	db = await connectDb();
});

let skiArea = {
	name: 'Test Ski Area',
	country: 'Test Country',
	region: 'Test Region',
	bounds: [1, 2, 3, 4],
	pistes: [],
	lifts: [],
	facilities: []
};



describe('Routing Routes', () => {
	let id;
	beforeAll(async () => {
		await db.collection('ski-areas').insertOne(skiArea);
		const skiAreaInstance = await db.collection('ski-areas').findOne({ name: 'Test Ski Area' });
		id = skiAreaInstance._id;
	});

	test('POST /api/routes/generate-route should return shortest route from a to b', async () => {
		// overpass response
		axios.post = jest.fn()
			.mockResolvedValueOnce({ data: overpassExampleData })
			// predicted ratings response
			.mockResolvedValueOnce({ data: ratingResponseExample })
			// route generation response
			.mockResolvedValueOnce({ data: generatedRouteExample });
		
		axios.get = jest.fn().mockResolvedValueOnce({ data: weatherResponseExample });

		const data = {
			start: { lat: 1, lon: 1 },
			end: { lat: 2, lon: 2 },
			skiArea: id
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			route: 'Dis way!',
			res: generatedRouteExample
		});
	});
	
	test('POST /api/routes/generate-route should return 400 if start or end is missing', async () => {
		const data = {
			start: { lat: 1, lon: 1 },
			skiArea: id
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.general.missingParam('end point'));
	});

	test('POST /api/routes/generate-route should return 400 if skiArea is missing', async () => {
		const data = {
			start: { lat: 1, lon: 1 },
			end: { lat: 2, lon: 2 }
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.general.missingParam('skiArea'));
	});

	test('POST /api/routes/generate-route should return 400 if ski area does not exist', async () => {
		const data = {
			start: { lat: 1, lon: 1 },
			end: { lat: 2, lon: 2 },
			skiArea: '5f9f6c3f9d5c1c2a3c3e3c3d'
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.skiArea.notFound);
	});

	test('POST /api/routes/generate-route should return 400 if start or end is not a valid point', async () => {
		const data = {
			start: 1,
			end: { lat: 2, lon: 2 },
			skiArea: id
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.routeGeneration.invalidPoint);
	});

	test('POST /api/routes/generate-route should return 400 if id is invalid', async () => {
		const data = {
			start: { lat: 1, lon: 1 },
			end: { lat: 2, lon: 2 },
			skiArea: 'invalid'
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.general.invalidId('skiArea'));
	});

	const data = (id) => ({
		start: { lat: 1, lon: 1 },
		end: { lat: 2, lon: 2 },
		skiArea: id
	});

	test('POST /api/routes/generate-route should return 500 if failed to fetch from overpass api', async () => {
		axios.post.mockResolvedValueOnce({ data: null });
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data(id));
		expect(response.status).toBe(500);
		expect(response.body).toEqual(err.routeGeneration.overpassApiError);
	});


	test('POST /api/routes/generate-route should return error if failed to fetch weather data', async () => {
    axios.post = jest.fn()
			.mockResolvedValueOnce({ data: overpassExampleData })
		axios.get = jest.fn().mockRejectedValueOnce();

    const response = await request(app)
      .post('/api/routes/generate-route')
      .send(data(id));
    expect(response.status).toBe(500);
    expect(response.body).toEqual(errorCodes.routeGeneration.weatherError);
  });

	// TODO: test for invalid rating data
  test('POST /api/routes/generate-route should return error if invalid rating', async () => {
    axios.post = jest.fn()
			.mockResolvedValueOnce({ data: overpassExampleData })
      .mockRejectedValueOnce();
		axios.get = jest.fn().mockResolvedValueOnce({ data: weatherResponseExample });

    const response = await request(app)
      .post('/api/routes/generate-route')
      .send(data(id));
    expect(response.status).toBe(500);
    expect(response.body).toEqual(errorCodes.routeGeneration.predictionError);
  });

	test('POST /api/routes/generate-route should return 500 if route generation service is not responding or result is empty', async () => {
		axios.post = jest.fn()
			.mockResolvedValueOnce({ data: overpassExampleData })
			.mockResolvedValueOnce({ data: ratingResponseExample })
			.mockRejectedValueOnce();
		axios.get = jest.fn().mockResolvedValueOnce({ data: weatherResponseExample });
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data(id));
		expect(response.status).toBe(500);
		expect(response.body).toEqual(err.routeGeneration.routeGenerationError);

		axios.post.mockResolvedValueOnce({ data: overpassExampleData })
			.mockResolvedValueOnce({ data: ratingResponseExample })
			.mockResolvedValueOnce({ data: null });
		axios.get = jest.fn().mockResolvedValueOnce({ data: weatherResponseExample });
		const response2 = await request(app)
			.post('/api/routes/generate-route')
			.send(data(id));
		expect(response2.status).toBe(500);
		expect(response2.body).toEqual(err.routeGeneration.routeGenerationError);
	});
	
});

afterAll(async () => {
	// You're my wonderwaaaaallllll
	await db.collection('ski-areas').deleteMany({});
	await db.collection('pistes').deleteMany({});
	await mongoose.connection.close();
	server.close();
});