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

axios.post = jest.fn()
	.mockResolvedValueOnce({ data: overpassExampleData })
	.mockResolvedValueOnce({ data: generatedRouteExample});

describe('Routing Routes', () => {
	let id;
	beforeAll(async () => {
		await db.collection('ski-areas').insertOne(skiArea);
		const skiAreaInstance = await db.collection('ski-areas').findOne({ name: 'Test Ski Area' });
		id = skiAreaInstance._id;
	});

	test('POST /api/routes/generate-route should return shortest route from a to b', async () => {
		const data = {
			start: { lat: 1, lng: 1 },
			end: { lat: 2, lng: 2 },
			skiArea: id
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(200);
		expect(response.body).toMatchObject({
			route: 'Dis way!',
			res: generatedRouteExample.features[0]
		});
	});

	test('POST /api/routes/generate-route should return 400 if start or end is missing', async () => {
		const data = {
			start: { lat: 1, lng: 1 },
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
			start: { lat: 1, lng: 1 },
			end: { lat: 2, lng: 2 }
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.general.missingParam('skiArea'));
	});

	test('POST /api/routes/generate-route should return 400 if ski area does not exist', async () => {
		const data = {
			start: { lat: 1, lng: 1 },
			end: { lat: 2, lng: 2 },
			skiArea: '5f9f6c3f9d5c1c2a3c3e3c3d'
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.skiArea.notFound);
	});

	// eslint-disable-next-line jest/no-commented-out-tests
	/*test('POST /api/routes/generate-route should return 400 if start or end is not a valid point', async () => {
		const data = {
			start: 1,
			end: { lat: 2, lng: 2 },
			skiArea: id
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.routeGeneration.invalidPoint);
	});*/

	test('POST /api/routes/generate-route should return 400 if id is invalid', async () => {
		const data = {
			start: { lat: 1, lng: 1 },
			end: { lat: 2, lng: 2 },
			skiArea: 'invalid'
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.general.invalidId('skiArea'));
	});


	test('POST /api/routes/generate-route should return 500 if failed to fetch from overpass api', async () => {
		axios.post.mockResolvedValueOnce({ data: null });
		const data = {
			start: { lat: 1, lng: 1 },
			end: { lat: 2, lng: 2 },
			skiArea: id
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(500);
		expect(response.body).toEqual(err.routeGeneration.overpassApiError);
	});

	test('POST /api/routes/generate-route should return 500 if route generation service is not responding', async () => {
		axios.post.mockResolvedValueOnce({ data: overpassExampleData }).mockRejectedValueOnce();
		const data = {
			start: { lat: 2, lng: 2 },
			end: { lat: 1, lng: 1 },
			skiArea: id
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(500);
		expect(response.body).toEqual(err.routeGeneration.routeGenerationError);
	});
});

afterAll(async () => {
	// You're my wonderwaaaaallllll
	await db.collection('ski-areas').deleteMany({});
	await mongoose.connection.close();
	server.close();
});