export default {

	// General Errors
	general: {
		dbUnavailable: {
			code: "E0001",
			message: "Database is unavailable",
		},
	},

	// Route generation errors
	routeGeneration: {
		missingPoint: {
			code: "E0101",
			message: "Start and end points are required",
		},
		missingSkiArea: {
			code: "E0102",
			message: "Ski area is required",
		},
		invalidPoint: {
			code: "E0103",
			message: "Invalid start or end point (must contain lat and lng)",
		},
		invalidSkiArea: {
			code: "E0104",
			message: "Invalid ski area id",
		},
		overpassApiError: {
			code: "E0105",
			message: "Could not fetch data from overpass API",
		},
		routeGenerationError: {
			code: "E0106",
			message: "Route generation service is currently not responding",
		},
	}, 

	skiArea: {
		missingId: {
			code: "E0201",
			message: "Ski area id is required",
		},
		invalidId: {
			code: "E0202",
			message: "Invalid ski area id",
		},
		notFound: {
			code: "E0203",
			message: "Ski area not found",
		},
	},

  //
};