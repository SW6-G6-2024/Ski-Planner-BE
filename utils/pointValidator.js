/**
 * Check if the object is a valid point (latitude and longitude)
 * @param {{lat: Number, lon: Number}} point object to be checked
 * @returns {Boolean} true if the object is a valid point, false otherwise
 */
const isPoint = (point) => {
	if (typeof point.lat === 'number' && typeof point.lon === 'number') {
		return true;
	}
	return false;
};

export { isPoint };