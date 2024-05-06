import getPisteDirection from '../../../utils/helpers/getPisteDirection';

describe('getPisteDirection', () => {
	it('should return the correct angle of the piste for arrays', () => {
		// Test case 1: Piste with positive angle
		const coordinates1 = [[0, 0], [1, 1]];
		expect(getPisteDirection(coordinates1)).toBeCloseTo(45);

		// Test case 2: Piste with negative angle
		const coordinates2 = [[0, 0], [-1, 1]];
		expect(getPisteDirection(coordinates2)).toBeCloseTo(135);

		// Test case 3: Piste with horizontal angle
		const coordinates3 = [[0, 0], [1, 0]];
		expect(getPisteDirection(coordinates3)).toBeCloseTo(0);

		// Test case 4: Piste with vertical angle
		const coordinates4 = [[0, 0], [0, 1]];
		expect(getPisteDirection(coordinates4)).toBeCloseTo(90);

		// Test case 5: Piste with angle greater than 360 degrees
		const coordinates5 = [[0, 0], [2, 2]];
		expect(getPisteDirection(coordinates5)).toBeCloseTo(45);
	});

	it('should return the correct angle of the piste for objects', () => {
		// Test case 1: Piste with positive angle
		const coordinates1 = [{ lat: 0, lon: 0 }, { lat: 1, lon: 1 }];
		expect(getPisteDirection(coordinates1)).toBeCloseTo(45);

		// Test case 2: Piste with negative angle
		const coordinates2 = [{ lat: 0, lon: 0 }, { lat: -1, lon: 1 }];
		expect(getPisteDirection(coordinates2)).toBeCloseTo(135);

		// Test case 3: Piste with horizontal angle
		const coordinates3 = [{ lat: 0, lon: 0 }, { lat: 1, lon: 0 }];
		expect(getPisteDirection(coordinates3)).toBeCloseTo(0);

		// Test case 4: Piste with vertical angle
		const coordinates4 = [{ lat: 0, lon: 0 }, { lat: 0, lon: 1 }];
		expect(getPisteDirection(coordinates4)).toBeCloseTo(90);

		// Test case 5: Piste with angle greater than 360 degrees
		const coordinates5 = [{ lat: 0, lon: 0 }, { lat: 2, lon: 2 }];
		expect(getPisteDirection(coordinates5)).toBeCloseTo(45);
	});
});
