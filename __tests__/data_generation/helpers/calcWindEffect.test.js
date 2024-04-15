import calculateWindEffect from "../../../data_generation/helpers/calcWindEffect";

describe('calculateWindEffect', () => {
	it('should calculate the effect of the wind on the skiing conditions', () => {
		expect(calculateWindEffect(0, 0)).toBe(0);
		expect(calculateWindEffect(0, 180)).toBe(1);
		expect(calculateWindEffect(0, 90)).toBe(0.5);
		expect(calculateWindEffect(0, 270)).toBe(0.5);
		expect(calculateWindEffect(0, 45)).toBe(0.25);
		expect(calculateWindEffect(0, 135)).toBe(0.75);
		expect(calculateWindEffect(0, 225)).toBe(0.75);
		expect(calculateWindEffect(0, 315)).toBe(0.25);
	});
});