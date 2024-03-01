import { overpassToGeoJson } from '../../utils/dataFormatter.js';
import exampleData from '../fixtures/overpassExampleData.js';
import err from '../../utils/errorCodes.js';

describe('toGeoJson', () => {
	test('should convert data to GeoJSON format', () => {

		const expectedGeoJson = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: {
						'piste:type': 'downhill',
						'piste:difficulty': 'easy',
						name: 'Example Piste'
					},
					geometry: {
						type: 'LineString',
						coordinates: [
							[12.1993807, 61.303757],
							[12.1943646, 61.3069892]
						]
					}
				},
				{
					type: 'Feature',
					properties: {
						aerialway: 'gondola',
						name: 'Example Lift'
					},
					geometry: {
						type: 'LineString',
						coordinates: [
							[12.1993807, 61.303757],
							[12.1943646, 61.3069892]
						]
					}
				},
			],
		};

		const result = overpassToGeoJson(exampleData);
		expect(result).toEqual(expectedGeoJson);
	});

	test('should throw error if data is invalid', () => {
		const invalidData = { data: "invalidData" };
		expect(() => overpassToGeoJson(invalidData)).toThrow(err.geoJson.missingGeometry);

		const invalidData2 = { elements: [{
			type: 'node',
			id: 123,
			lat: 61.303757,
			lon: 12.1993807
		}] };

		expect(() => overpassToGeoJson(invalidData2)).toThrow('Invalid data: Must contain elements with geometry.');
	});
});
