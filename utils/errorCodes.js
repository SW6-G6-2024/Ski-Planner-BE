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
		weatherError: {
			code: "E0103",
			message: "Weather service is currently not responding",
		},
		predictionError: {
			code: "E0104",
			message: "Prediction service is currently not responding",
		},
		routeGenerationError: {
			code: "E0105",
			message: "Route generation service is currently not responding",
		},
		noRouteFound: {
			code: "E0106",
			message: "No route found",
		},
		invalidBestRouteInput: {
			code: "E0107",
			message: "Invalid input for best route generation",
		},
	}, 

	skiArea: {
		notFound: {
			code: "E0201",
			message: "Ski area not found",
		},
	},

  pistes: {
		notFound: {
			code: "E0301",
			message: "Piste not found",
		},
		saveError: {
			code: "E0302",
			message: "Could not save piste",
		},
		invalidRatingInterval: {
			code: "E0303",
			message: "Rating must be between 1 and 5",
		},
		invalidPisteId: {
			code: "E0304",
			message: "Invalid piste id",
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