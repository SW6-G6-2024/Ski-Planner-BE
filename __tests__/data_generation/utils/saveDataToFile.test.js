import saveDataToFile from '../../../data_generation/utils/saveDataToFile.js';
import fs from 'fs';

const filePath = '__tests__/data_generation/test.json';

describe('saveDataToFile', () => {
	it('should save data to file', () => {
		// Check that file does not already exist
		expect(fs.existsSync(filePath)).toBe(false);

		// Test case 1: Save data to file and check if the file exists
		const data = { name: 'John Doe', age: 30 };
		saveDataToFile(data, filePath, true);
		// TODO: Add assertion to check if the file exists
		expect(fs.existsSync(filePath)).toBe(true);
		expect(fs.readFileSync(filePath).toString()).toBe(JSON.stringify(data, null, 2));

		// Test case 2: Save empty data to same file and check if the file has been overwritten
		const emptyData = {};
		saveDataToFile(emptyData, filePath, true);
		expect(fs.existsSync(filePath)).toBe(true);
		expect(fs.readFileSync(filePath).toString()).toBe(JSON.stringify(emptyData, null, 2));

		// Test case 3: Save new data to same file and check if the file has been overwritten
		const newData = { name: 'Jane Doe', age: 25 };
		saveDataToFile(newData, filePath, true);
		expect(fs.existsSync(filePath)).toBe(true);
		expect(fs.readFileSync(filePath).toString()).toBe(JSON.stringify(newData, null, 2));
	});

	it('should save empty data to file', () => {
		// Check that file does not already exist
		expect(fs.existsSync(filePath)).toBe(false);

		// Test case 1: Save empty data to file and check if the file exists
		const data = {};
		saveDataToFile(data, filePath, true);
		expect(fs.existsSync(filePath)).toBe(true);
		expect(fs.readFileSync(filePath).toString()).toBe(JSON.stringify(data, null, 2));
	});

	it('should throw an error if file path is not a string, Buffer or URL', () => {
		// Test case 1: Call saveDataToFile with an invalid file path and check if it throws an error
		const data = { name: 'John Doe', age: 30 };
		const filePath = 123;
		expect(() => saveDataToFile(data, filePath)).toThrow(Error('EBADF: bad file descriptor, write'));
	});

	it('should throw an error if file path is not provided', () => {
		// Test case 1: Call saveDataToFile without file path and check if it throws an error
		const data = { name: 'John Doe', age: 30 };
		expect(() => saveDataToFile(data, undefined))
			.toThrow(TypeError('The "path" argument must be of type string or an instance of Buffer or URL. Received undefined'));
	});

	it('should throw an error if data is not provided', () => {
		// Test case 1: Call saveDataToFile without data and check if it throws an error
		expect(() => saveDataToFile(undefined, filePath))
			.toThrow(TypeError('The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received undefined'));
	});

	afterEach(() => {
		// Clean up the file created during testing
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
	});
});


