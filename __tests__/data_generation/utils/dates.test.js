import { daysInMonth } from '../../../data_generation/utils/dates.js';

describe('daysInMonth', () => {
	it('should return the correct number of days for a given month and year', () => {
		expect(daysInMonth(2, 2022)).toBe(28); // February 2022 has 28 days
		expect(daysInMonth(2, 2024)).toBe(29); // February 2024 has 29 days (leap year)
		expect(daysInMonth(12, 2023)).toBe(31); // December 2023 has 31 days
		expect(daysInMonth(4, 2024)).toBe(30); // April 2024 has 30 days
		expect(daysInMonth(1, 2023)).toBe(31); // January 2023 has 31 days
		expect(daysInMonth(-2, -2023)).toBe(31); // -2023 - 2 months = 2024 BC (-2024), month december - 2 = october, 31 days
	});

	it('should handle negative numbers as years BC', () => {
		expect(daysInMonth(2, -2022)).toBe(28); // February 2022 BC has 28 days
		expect(daysInMonth(2, -2024)).toBe(29); // February 2024 BC has 29 days (leap year)
		expect(daysInMonth(12, -2023)).toBe(31); // December 2023 BC has 31 days
		expect(daysInMonth(4, -2024)).toBe(30); // April 2024 BC has 30 days
		expect(daysInMonth(1, -2023)).toBe(31); // January 2023 BC has 31 days
	});

	it('should handle negative numbers as months before given year', () => {
		expect(daysInMonth(-2, 2022)).toBe(31); // 2022 - 2 months = 2021, month december - 2 = october, 31 days
		expect(daysInMonth(-1, 2024)).toBe(30); // 2024 - 1 month = 2023, month december - 1 = november, 30 days
		expect(daysInMonth(-10, 2023)).toBe(28); // 2023 - 10 months = 2022, month december - 10 = february, 28 days
	});

	it('should handle months greater than 12', () => {
		expect(daysInMonth(13, 2022)).toBe(31); // 2022 + 13 month = 2023, month january, 31 days
		expect(daysInMonth(14, 2024)).toBe(28); // 2024 + 14 months = 2025, month february, 28 days
		expect(daysInMonth(15, 2023)).toBe(31); // 2023 + 15 months = 2024, month march, 31 days
	});
});
