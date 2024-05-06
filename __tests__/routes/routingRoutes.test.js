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

/**
 * Setup the responses for the axios requests in the route generation
 * @param {Boolean} overpassPass whether the overpass request should 
 * @param {Boolean} ratingPass 
 * @param {Boolean} routePass 
 * @param {Bolean} weatherResolve 
 */
function setupRequestResponses(overpassResolve, ratingResolve, routeResolve, weatherResolve) {
	axios.post = jest.fn()
		.mockResolvedValueOnce(overpassResolve ? {  data: overpassExampleData } : { data: null});
	ratingResolve ? axios.post.mockResolvedValueOnce({ data: ratingResponseExample }) : axios.post.mockRejectedValueOnce();
	routeResolve ? axios.post.mockResolvedValueOnce({ data: generatedRouteExample }) : axios.post.mockRejectedValueOnce();
	axios.get = weatherResolve ? jest.fn().mockResolvedValueOnce({ data: weatherResponseExample }) : jest.fn().mockRejectedValueOnce();
}

describe('Routing Routes', () => {
	let id;
	beforeAll(async () => {
		await db.collection('ski-areas').insertOne(skiArea);
		const skiAreaInstance = await db.collection('ski-areas').findOne({ name: 'Test Ski Area' });
		id = skiAreaInstance._id;
	});

	test('POST /api/routes/generate-route should return shortest route from a to b', async () => {
		// overpass response
		setupRequestResponses(true, true, true, true);

		const data = {
			start: { lat: 1, lon: 1 },
			end: { lat: 2, lon: 2 },
			isBestRoute: false,
			settings: {},
			skiArea: id
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			res: generatedRouteExample
		});
	});

	test('POST /api/routes/generate-route should return 400 if start or end is missing', async () => {
		const data = {
			start: { lat: 1, lon: 1 },
			isBestRoute: false,
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
			end: { lat: 2, lon: 2 },
			isBestRoute: false,
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
			isBestRoute: false,
			settings: {},
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
			isBestRoute: false,
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
			isBestRoute: false,
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
		isBestRoute: false,
		settings: {},
		skiArea: id
	});

	test('POST /api/routes/generate-route should return 500 if failed to fetch from overpass api', async () => {
		setupRequestResponses(false, true, true, true);
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data(id));
		expect(response.status).toBe(500);
		expect(response.body).toEqual(err.routeGeneration.overpassApiError);
	});

	test('POST /api/routes/generate-route should return error if failed to fetch weather data', async () => {
		setupRequestResponses(true, true, true, false);

		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data(id));
		expect(response.status).toBe(500);
		expect(response.body).toEqual(errorCodes.routeGeneration.weatherError);
	});

	// TODO: test for invalid rating data
	test('POST /api/routes/generate-route should return error if invalid rating', async () => {
		setupRequestResponses(true, false, true, true);

		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data(id));

		expect(response.status).toBe(500);
		expect(response.body).toEqual(errorCodes.routeGeneration.predictionError);
	});

	test('POST /api/routes/generate-route should return 500 if route generation service is not responding or result is empty', async () => {
		setupRequestResponses(true, true, false, true);
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data(id));
		expect(response.status).toBe(500);
		expect(response.body).toEqual(err.routeGeneration.routeGenerationError);

		axios.post = jest.fn()
			.mockResolvedValueOnce({ data: overpassExampleData })
			.mockResolvedValueOnce({ data: ratingResponseExample })
			.mockResolvedValueOnce({ data: null });
		axios.get = jest.fn().mockResolvedValueOnce({ data: weatherResponseExample });
		const response2 = await request(app)
			.post('/api/routes/generate-route')
			.send(data(id));
		expect(response2.status).toBe(500);
		expect(response2.body).toEqual(err.routeGeneration.routeGenerationError);
	});

	test('POST /api/routes/generate-route should return 400 if best route input is invalid', async () => {
		const data = {
			start: { lat: 1, lon: 1 },
			end: { lat: 2, lon: 2 },
			isBestRoute: 'invalid',
			settings: {},
			skiArea: id
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.routeGeneration.invalidBestRouteInput);
	});

	test('POST /api/routes/generate-route should return 400 if best route input is missing', async () => {
		const data = {
			start: { lat: 1, lon: 1 },
			end: { lat: 2, lon: 2 },
			skiArea: id,
			settings: {}
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.general.missingParam('isBestRoute'));
	});

	test('POST /api/routes/generate-route should return 400 if settings is missing', async () => {
		const data = {
			start: { lat: 1, lon: 1 },
			end: { lat: 2, lon: 2 },
			isBestRoute: false,
			skiArea: id
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.general.missingParam('settings'));
	});

	test('POST /api/routes/generate-route should return 400 if settings is not an object', async () => {
		const data = {
			start: { lat: 1, lon: 1 },
			end: { lat: 2, lon: 2 },
			isBestRoute: false,
			settings: 'invalid',
			skiArea: id
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.routeGeneration.invalidPreferenceInput);
	});
});

afterAll(async () => {
	// You're my wonderwaaaaallllll
	await db.collection('ski-areas').deleteMany({});
	await db.collection('pistes').deleteMany({});
	await mongoose.connection.close();
	server.close();
});