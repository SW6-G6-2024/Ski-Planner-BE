import mongoose from 'mongoose';
import generateRatings from '../../data_generation/generateData.js';
import connectDb from '../fixtures/db.js';
import fs from 'fs';

let db;

beforeAll(async () => {
	db = await connectDb();
	const pistes = JSON.parse(fs.readFileSync("__tests__/fixtures/test-pistes.json", "utf8"));
	await db.collection('pistes').insertMany(pistes);
});

describe('generateRatings', () => {

	it('should generate an array of ratings with the specified number of entries', async () => {
		const numEntries = 10;
		const ratings = await generateRatings(numEntries, true);

		expect(ratings).toHaveLength(numEntries * 131 /* number of pistes */);
		ratings.forEach((rating) => {
			expect(rating).toMatchObject({
				piste: {
					_id: expect.any(Number),
					direction: expect.any(Number),
					name: expect.any(String),
					modifiedAt: expect.any(Date),
				},
				user: null,
				points: expect.any(Number),
				year: expect.any(Number),
				month: expect.any(Number),
				day: expect.any(Number),
				hours: expect.any(Number),
				minutes: expect.any(Number),
				weather: {
					temperature: expect.any(Number),
					weatherCode: expect.any(Number),
					rain: expect.any(Number),
					windSpeed: expect.any(Number),
					windDirection: expect.any(Number),
					visibility: expect.any(Number),
					snowfall: expect.any(Number),
					snowDepth: expect.any(Number),
				},
			});
		});
	});
});

afterAll(async () => {
	// You're my wonderwall
	await mongoose.connection.close();
});