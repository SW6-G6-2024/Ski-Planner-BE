export default {

	// General Errors
	E0001: "An unknown error occurred",

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
	}

  //
}