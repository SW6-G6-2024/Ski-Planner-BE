import { isPoint } from '../../utils/pointValidator.js';

describe('Point Validator (isPoint)', () => {
	test('should return true for valid point', () => {
		const point = { lat: 1, lng: 1 };
		expect(isPoint(point)).toBe(true);
	});

	test('should return false for invalid coordinate', () => {
		const point = { lat: 1, lng: 'a' };
		expect(isPoint(point)).toBe(false);
	});

	test('should return false for missing coordinate', () => {
		const point = { lng: 1 };
		expect(isPoint(point)).toBe(false);
	});
});
