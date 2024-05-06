import { isPreference } from '../../../utils/validators/preferenceValidator.js';

describe('isPreference', () => {
	it('should return true for valid preference', () => {
		const preference = { green: true, red: false, blue: true, black: false, platter: true, tBar: false, gondola: true, chair: false };
	
		expect(isPreference(preference)).toBe(true);
	});
	
	it('should return false for invalid type', () => {
		const preference = { green: true, red: false, blue: true, black: false, platter: true, tBar: false, gondola: true, chair: 'a' };
	
		expect(isPreference(preference)).toBe(false);
	});
});
