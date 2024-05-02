/**
 * @typedef {Object} Feature
 * @property {String} type - The type of the object
 * @property {Object} properties - The properties of the object
 * @property {Geometry} geometry - The geometry of the object
 */

/**
 * @typedef {Object} Geometry
 * @property {String} type - The type of the geometry
 * @property {Array<Array<Number>>} coordinates - The coordinates of the geometry
 */

/**
 * @typedef {Object} FeatureCollection
 * @property {String} type - The type of the object
 * @property {Array<Feature>} features - The features of the object
 */

/**
 * @typedef {object} Rating
 * @property {piste} piste piste object
 * @property {string} user user id
 * @property {Number} points points for the rating
 * @property {Number} year year of the rating
 * @property {Number} month month of the rating
 * @property {Number} day day of the rating
 * @property {Number} hours hours of the rating
 * @property {Number} minutes minutes of the rating
 * @property {weather} weather weather object
 */

/**
 * @typedef {object} Weather
 * @property {Number} code weather code
 * @property {Number} temperature temperature in celsius
 * @property {Number} visibility visibility in meters
 * @property {Number} windDirection wind direction in degrees
 * @property {Number} windSpeed wind speed (km/h)
 * @property {Number} snowfall snowfall in cm
 * @property {Number} snowDepth snow depth in cm
 * @property {Number} downpour downpour in mm
 */

/**
 * @typedef {object} Piste
 * @property {string} name name of the piste
 * @property {string} direction direction of the piste
 * @property {Number} id id of the piste
 * @property {string} skiArea id for ski area of the piste
 */

/**
 * @typedef {Object} Param
 * @property {String} name - The name of the parameter
 * @property {Object} value - The value to be checked
 * @property {Boolean} id - (Optional) Whether the parameter is an id
 * @property {Function} func - (Optional) The function to be used to check the parameter
 * @property {Object} funcErr - (Optional) The error to be sent if the parameter is invalid
 */

/**
 * @typedef {Object} OverpassResult
 * @property {Number} version version of the overpass api
 * @property {String} generator generator of the overpass api
 * @property {{timestamp_osm_base: String, copyright: String}} osm3s license
 * @property {Array<OverpassFeature>} elements elements returned by the overpass api
 */

/**
 * @typedef {Object} OverpassFeature
 * @property {String} type The type of the element (e.g. 'way')
 * @property {Number} id The id of the element
 * @property {Bounds} bounds The bounds of the element
 * @property {Array<Number>} nodes The nodes of the element
 * @property {Array<{lat: Number, lon: Number}>} geometry The geometry of the element
 * @property {Object} tags The tags of the element
 */

/**
 * @typedef {Object} Bounds
 * @property {Number} minlat The minimum latitude of the bounds
 * @property {Number} minlon The minimum longitude of the bounds
 * @property {Number} maxlat The maximum latitude of the bounds
 * @property {Number} maxlon The maximum longitude of the bounds
 */

/**
 * @typedef {Object} Input
 * @property {point} start The starting point of the route
 * @property {point} end The ending point of the route
 * @property {string} skiArea The ID of the ski area
 * @property {Preference} settings The user's preferences
 * @property {boolean} isBestRoute Whether to generate the best route or the shortest route
 */

/**
 * @typedef {Object} point
 * @property {Number} lat Latitude of the point
 * @property {Number} lon Longitude of the point
 */

/**
 * @typedef {Object} Preference
 * @property {Boolean} green Whether to include green pistes
 * @property {Boolean} blue Whether to include blue pistes
 * @property {Boolean} red Whether to include red pistes
 * @property {Boolean} black Whether to include black pistes
 * @property {Boolean} button Whether to include button lifts
 * @property {Boolean} tBar Whether to include t-bar lifts
 * @property {Boolean} chair Whether to include chair lifts
 * @property {Boolean} gondola Whether to include gondola lifts
 */ 