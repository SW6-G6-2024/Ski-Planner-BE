import { getTempAndVisWeight } from '../../../data_generation/helpers/getTempAndVis.js';

describe('getTempAndVisWeight', () => {
	it('should return the correct weight for temperature and visibility when time is before the first weight data', () => {
		const time = new Date('2022-01-01T08:00:00');
		const weatherCode = 0;
		const expectedWeight = { temp: 0.8, visibility: 0.7 };

		const result = getTempAndVisWeight(time, weatherCode);

		expect(result).toEqual(expectedWeight);
	});

	it('should return the correct weight for temperature and visibility when time is between two weight data', () => {
		const time = new Date('2022-01-01T11:00:00');
		const weatherCode = 1;
		const expectedWeight = { temp: 0.9, visibility: 0.8 };

		const result = getTempAndVisWeight(time, weatherCode);

		expect(result).toEqual(expectedWeight);
	});

	it('should return the correct weight for temperature and visibility when time is after the last weight data', () => {
		const time = new Date('2022-01-01T18:00:00');
		const weatherCode = 2;
		const expectedWeight = { temp: 0.7, visibility: 0.8 };

		const result = getTempAndVisWeight(time, weatherCode);

		expect(result).toEqual(expectedWeight);
	});
});
