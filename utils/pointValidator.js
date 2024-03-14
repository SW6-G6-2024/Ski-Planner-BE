/**
 * Check if the object is a valid point (latitude and longitude)
 * @param {*} point object to be checked
 * @returns 
 */
const isPoint = (point) => {
	if (typeof point.lat === 'number' && typeof point.lon === 'number') {
		return true;
	}
	return false;
};

export { isPoint };