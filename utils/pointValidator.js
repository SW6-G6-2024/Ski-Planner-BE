
const isPoint = (point) => {
	if (typeof point.lat === 'number' && typeof point.lng === 'number') {
		return true;
	}
	return false;
};

export { isPoint };