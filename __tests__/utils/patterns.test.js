import regexPatterns from '../../utils/patterns.js';

describe('Regex Patterns', () => {
	test('Website URL pattern', () => {
		const validUrls = [
			'https://www.example.com',
			'http://example.com',
			'https://example123.com',
			'http://www.example123.com/',
			'https://www.überexample.com',
			'http://www.überexample123.com',
			'https://www.æøåexample.com',
			'http://www.æøåexample123.com',
			'https://www.äöüexample.com',
			'http://www.äöüexample123.com',
			'https://www.example-example.com/',
		];

		const invalidUrls = [
			'example.com',
			'www.example.com',
			'http://example', 
			'https://www.example.',
			'https://www.überexample',
			'http://www.überexample.',
			'https://www.æøåexample',
			'http://www.æøåexample.',
			'https://www.äöüexample',
			'http://www.äöüexample.',
			'https://www.s-example.',
		];

		validUrls.forEach((url) => {
			expect(regexPatterns.website.test(url)).toBe(true);
		});

		invalidUrls.forEach((url) => {
			expect(regexPatterns.website.test(url)).toBe(false);
		});
	});
});
