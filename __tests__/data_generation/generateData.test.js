import { generateRatings } from '../../data_generation/generateData.js';

describe('generateRatings', () => {
	it('should generate an array of ratings with the specified number of entries', () => {
		const numEntries = 10;
		const ratings = generateRatings(numEntries);

		expect(ratings).toHaveLength(numEntries);
		ratings.forEach((rating) => {
			expect(rating).toMatchObject({
				piste: expect.any(String),
				user: null,
				points: expect.any(Number),
				time: expect.any(Date),
				weather: {
					temperature: expect.any(Number),
					downpour: expect.any(Number),
					windSpeed: expect.any(Number),
					windDirection: expect.any(Number),
					visibility: expect.any(Number),
					snowDepth: expect.any(Number),
				}
			})
		});
	});
});
