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
		noRouteFound: {
			code: "E0104",
			message: "No route found",
		},
	}, 

	skiArea: {
		notFound: {
			code: "E0201",
			message: "Ski area not found",
		},
	},

  pistes: {
    saveError: {
      code: "E0301",
      message: "Could not save piste",
    },
  },

  geoJson: {
    invalidObject: {
      code: "E0401",
      message: "Invalid geoJson object",
    },
    missingGeometry: {
      code: "E0402",
      message: "Invalid data: Must contain elements with geometry.",
    },
  }

  //
};