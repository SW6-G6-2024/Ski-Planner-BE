export default {

	// General Errors
	general: {
		dbUnavailable: {
			code: "E0001",
			message: "Database is unavailable",
		},
		missingParam: (name) => ({
			code: "E0002",
			message: `Missing parameter: ${name} is required`,
		}),
		invalidId: (name) => ({
			code: "E0003",
			message: `Invalid id: ${name} is an invalid id`,
		}),
	},

	// Route generation errors
	routeGeneration: {
		invalidPoint: {
			code: "E0101",
			message: "Invalid start or end point (must contain lat and lng)",
		},
		overpassApiError: {
			code: "E0102",
			message: "Could not fetch data from overpass API",
		},
		routeGenerationError: {
			code: "E0103",
			message: "Route generation service is currently not responding",
		},
	}, 

	skiArea: {
		notFound: {
			code: "E0201",
			message: "Ski area not found",
		},
	},

  //
};