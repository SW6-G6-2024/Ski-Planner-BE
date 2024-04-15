
/**
 * Calculate the effect of the wind on the skiing conditions
 * @param {Number} windDir direction of the wind in degrees (0-359)
 * @param {Number} pisteDir direction of the piste in degrees (0-359)
 * @returns {Number} a number between 0 and 1 representing the effect of the wind on the skiing conditions
 */
function calculateWindEffect(windDir, pisteDir) {
	const windDirection = (windDir + 360) % 360;
	const pisteDirection = (pisteDir + 360) % 360;

	let diff = Math.abs(windDirection - pisteDirection);

	diff = Math.min(diff, 360 - diff);

	return diff / 180;
}

export default calculateWindEffect;