import request from 'supertest';
import express from 'express';
import router from '../../routes/routingRoutes.js';
import err from '../../utils/errorCodes.js';
import connectDb from '../fixtures/db.js';
import mongoose from 'mongoose';

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
		await db.collection('ski-areas').deleteMany({});
		await db.collection('ski-areas').insertOne(skiArea);
		const skiAreaInstance = await db.collection('ski-areas').findOne({ name: 'Test Ski Area' });
		id = skiAreaInstance._id;
	});

	/*test('POST /api/routes/generate-route should return shortest route from a to b', async () => {
		const data = {
			start: { lat: 1, lng: 1 },
			end: { lat: 2, lng: 2 },
			skiArea: id
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		//expect(response.status).toBe(200);
		expect(response.body.res.data).toMatchObject({
			start: data.start,
			end: data.end,
			skiArea: {
				name: skiArea.name,
				bounds: skiArea.bounds,
				country: skiArea.country,
				region: skiArea.region,
				pistes: skiArea.pistes,
				lifts: skiArea.lifts,
				facilities: skiArea.facilities,
				modifiedAt: expect.any(String)
			}
		});
	});*/

	test('POST /api/routes/generate-route should return 400 if start or end is missing', async () => {
		const data = {
			start: { lat: 1, lng: 1 },
			skiArea: id
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.routeGeneration.missingPoint);
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
			start: { lat: 1, lng: 1 },
			end: { lat: 2, lng: 2 },
			skiArea: 'invalid'
		};
		const response = await request(app)
			.post('/api/routes/generate-route')
			.send(data);
		expect(response.status).toBe(400);
		expect(response.body).toEqual(err.routeGeneration.invalidSkiArea);
	});
});

afterAll(async () => {
	// You're my wonderwaaaaallllll
	await mongoose.connection.close();
	server.close();
});