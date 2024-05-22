import { jest } from '@jest/globals';
import getCurrentArrayElement from '../../../utils/helpers/getCurrentArrayElement.js';

describe('getCurrentArrayElement', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return the element corresponding to the closest hour of the array', () => {
		jest.setSystemTime(new Date(2022, 1, 1, 12, 18, 12, 13));
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
		const result = getCurrentArrayElement(array);
		expect(result).toBe(12);
  });

	it('should return the element corresponding to the closest hour of the array (>=30 min --> next hour)', () => {
		jest.setSystemTime(new Date(2022, 1, 1, 12, 30, 12, 13));
		const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
		const result = getCurrentArrayElement(array);
		expect(result).toBe(13);
	});

  // Add more test cases if needed
});
